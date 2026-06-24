-- ============================================================
-- UniJourney CRM — Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is admin+
CREATE OR REPLACE FUNCTION is_admin_or_above()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin_or_above());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Super admin can update any profile"
  ON profiles FOR UPDATE
  USING (get_user_role() = 'super_admin');

-- ============================================================
-- LEADS POLICIES
-- ============================================================
CREATE POLICY "Admins can read all leads"
  ON leads FOR SELECT
  USING (is_admin_or_above());

CREATE POLICY "Staff can read assigned leads"
  ON leads FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR owner_id = auth.uid()
  );

CREATE POLICY "Clients can read own leads"
  ON leads FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Staff+ can create leads"
  ON leads FOR INSERT
  WITH CHECK (
    get_user_role() IN ('staff', 'admin', 'super_admin')
  );

CREATE POLICY "Staff+ can update assigned or own leads"
  ON leads FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR assigned_to = auth.uid()
    OR is_admin_or_above()
  );

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  USING (is_admin_or_above());

-- ============================================================
-- APPLICATIONS POLICIES
-- ============================================================
CREATE POLICY "Admins can read all applications"
  ON applications FOR SELECT
  USING (is_admin_or_above());

CREATE POLICY "Users can read own applications"
  ON applications FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff+ can update applications"
  ON applications FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR is_admin_or_above()
  );

CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  USING (is_admin_or_above());

-- ============================================================
-- UNIVERSITIES POLICIES
-- ============================================================
CREATE POLICY "All authenticated users can read universities"
  ON universities FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create universities"
  ON universities FOR INSERT
  WITH CHECK (is_admin_or_above());

CREATE POLICY "Admins can update universities"
  ON universities FOR UPDATE
  USING (is_admin_or_above());

CREATE POLICY "Admins can delete universities"
  ON universities FOR DELETE
  USING (is_admin_or_above());

-- ============================================================
-- DOCUMENTS POLICIES
-- ============================================================
CREATE POLICY "Admins can read all documents"
  ON documents FOR SELECT
  USING (is_admin_or_above());

CREATE POLICY "Users can read own documents"
  ON documents FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can upload documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Staff+ can update documents"
  ON documents FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR is_admin_or_above()
  );

CREATE POLICY "Admins can delete documents"
  ON documents FOR DELETE
  USING (is_admin_or_above());

-- ============================================================
-- SUPPORT TICKETS POLICIES
-- ============================================================
CREATE POLICY "Admins can read all tickets"
  ON support_tickets FOR SELECT
  USING (is_admin_or_above());

CREATE POLICY "Users can read own tickets"
  ON support_tickets FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owner and admins can update tickets"
  ON support_tickets FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR is_admin_or_above()
  );

-- ============================================================
-- TICKET RESPONSES POLICIES
-- ============================================================
CREATE POLICY "Users can read responses for their tickets"
  ON ticket_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_responses.ticket_id
      AND (support_tickets.owner_id = auth.uid() OR is_admin_or_above())
    )
  );

CREATE POLICY "Authenticated users can create responses"
  ON ticket_responses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- COMPANY SETTINGS POLICIES
-- ============================================================
CREATE POLICY "All authenticated users can read company settings"
  ON company_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update company settings"
  ON company_settings FOR UPDATE
  USING (is_admin_or_above());

-- ============================================================
-- NOTIFICATION PREFERENCES POLICIES
-- ============================================================
CREATE POLICY "Users can read own notification preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (user_id = auth.uid());
