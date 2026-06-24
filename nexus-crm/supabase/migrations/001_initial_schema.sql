-- ============================================================
-- UniJourney CRM — Initial Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff', 'client');
CREATE TYPE lead_status AS ENUM (
  'new_lead', 'contacted', 'follow_up', 'qualified',
  'application_started', 'documentation', 'submission',
  'approved', 'rejected', 'converted', 'lost', 'closed', 'closed_lost'
);
CREATE TYPE application_status AS ENUM (
  'application_started', 'documentation', 'submission', 'approved', 'visa_filing'
);
CREATE TYPE document_category AS ENUM (
  'passport', 'transcript', 'sop', 'lor', 'financial', 'test_score', 'visa'
);
CREATE TYPE document_status AS ENUM ('verified', 'pending_review', 'expired');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'client',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  status lead_status NOT NULL DEFAULT 'new_lead',
  source TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  value NUMERIC NOT NULL DEFAULT 0,
  counselor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  group_name TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  follow_up_date TIMESTAMPTZ,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL DEFAULT '',
  university_id UUID,
  course TEXT NOT NULL DEFAULT '',
  status application_status NOT NULL DEFAULT 'application_started',
  deadline TIMESTAMPTZ NOT NULL DEFAULT now(),
  fee NUMERIC NOT NULL DEFAULT 0,
  intake TEXT NOT NULL DEFAULT '',
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- UNIVERSITIES
-- ============================================================
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  intake TEXT[] NOT NULL DEFAULT '{}',
  acceptance_rate NUMERIC NOT NULL DEFAULT 0,
  active_applications INT NOT NULL DEFAULT 0,
  partner_since TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category document_category NOT NULL DEFAULT 'passport',
  status document_status NOT NULL DEFAULT 'pending_review',
  student_name TEXT NOT NULL DEFAULT '',
  student_id TEXT NOT NULL DEFAULT '',
  file_type TEXT NOT NULL DEFAULT '',
  file_size BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL DEFAULT '',
  expiry_date TIMESTAMPTZ,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TICKET RESPONSES
-- ============================================================
CREATE TABLE ticket_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ticket_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMPANY SETTINGS (single row per org)
-- ============================================================
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  founded TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Insert default company settings row
INSERT INTO company_settings (id) VALUES (uuid_generate_v4());

-- ============================================================
-- NOTIFICATION PREFERENCES (per user)
-- ============================================================
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  new_lead_assigned BOOLEAN NOT NULL DEFAULT false,
  application_status_update BOOLEAN NOT NULL DEFAULT false,
  document_uploaded_verified BOOLEAN NOT NULL DEFAULT false,
  visa_decision_received BOOLEAN NOT NULL DEFAULT false,
  follow_up_due_today BOOLEAN NOT NULL DEFAULT false,
  weekly_performance_report BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_leads_owner ON leads(owner_id);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_applications_owner ON applications(owner_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_support_tickets_owner ON support_tickets(owner_id);
CREATE INDEX idx_ticket_responses_ticket ON ticket_responses(ticket_id);
CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);
