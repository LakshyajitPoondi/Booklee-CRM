-- ============================================================
-- Fix: Allow authenticated users to create their own leads
--
-- ROOT CAUSE: The original "Staff+ can create leads" policy
-- required role IN ('staff', 'admin', 'super_admin'), but the
-- profile trigger creates all new users with role = 'client'.
-- This means no newly signed-up user could ever insert leads,
-- which caused silent insert failures (swallowed by .catch()).
--
-- FIX: Replace the restrictive policy with one that allows any
-- authenticated user to insert leads where owner_id = auth.uid().
-- This matches the pattern used by applications, documents, and
-- support_tickets tables.
-- ============================================================

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Staff+ can create leads" ON leads;

-- Allow any authenticated user to insert leads they own
CREATE POLICY "Authenticated users can create own leads"
  ON leads FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND owner_id = auth.uid()
  );
