-- ============================================================
-- UniJourney CRM — Auto-create profile on signup
-- Run this AFTER 002_rls_policies.sql
-- ============================================================

-- Trigger function: auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'client'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Also create default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Create storage buckets (run these in the SQL editor)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('contracts', 'contracts', false),
  ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Documents bucket: users can upload/read their own files, admins can access all
CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can read own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR is_admin_or_above()
    )
  );

CREATE POLICY "Admins can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR is_admin_or_above()
    )
  );

-- Contracts bucket: admin only
CREATE POLICY "Admins can manage contracts"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'contracts'
    AND is_admin_or_above()
  );

-- Profile images: users can upload their own, public read
CREATE POLICY "Users can upload own profile image"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can read profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can update own profile image"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile image"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
