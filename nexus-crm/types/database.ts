/* ============================================================
 * Database types — mirrors the Supabase schema
 * ============================================================ */

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'client';

export type LeadStatusDB =
  | 'new_lead'
  | 'contacted'
  | 'follow_up'
  | 'qualified'
  | 'application_started'
  | 'documentation'
  | 'submission'
  | 'approved'
  | 'rejected'
  | 'converted'
  | 'lost'
  | 'closed'
  | 'closed_lost';

export type ApplicationStatusDB =
  | 'application_started'
  | 'documentation'
  | 'submission'
  | 'approved'
  | 'visa_filing';

export type DocumentCategoryDB =
  | 'passport'
  | 'transcript'
  | 'sop'
  | 'lor'
  | 'financial'
  | 'test_score'
  | 'visa';

export type DocumentStatusDB = 'verified' | 'pending_review' | 'expired';

export type TicketStatusDB = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriorityDB = 'low' | 'medium' | 'high' | 'urgent';

/* ---- Profiles ---- */
export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}
export type ProfileInsert = Omit<ProfileRow, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<ProfileRow, 'id' | 'created_at'>>;

/* ---- Leads ---- */
export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatusDB;
  source: string;
  country: string;
  value: number;
  counselor_id: string | null;
  group_name: string;
  notes: string;
  follow_up_date: string | null;
  owner_id: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}
export type LeadInsert = Omit<LeadRow, 'id' | 'created_at' | 'updated_at'>;
export type LeadUpdate = Partial<Omit<LeadRow, 'id' | 'created_at'>>;

/* ---- Applications ---- */
export interface ApplicationRow {
  id: string;
  student_name: string;
  student_email: string;
  university_id: string | null;
  course: string;
  status: ApplicationStatusDB;
  deadline: string;
  fee: number;
  intake: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
export type ApplicationInsert = Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at'>;
export type ApplicationUpdate = Partial<Omit<ApplicationRow, 'id' | 'created_at'>>;

/* ---- Universities ---- */
export interface UniversityRow {
  id: string;
  name: string;
  country: string;
  city: string;
  intake: string[];
  acceptance_rate: number;
  active_applications: number;
  partner_since: string;
  contact_email: string;
  website: string;
  created_at: string;
}
export type UniversityInsert = Omit<UniversityRow, 'id' | 'created_at'>;
export type UniversityUpdate = Partial<Omit<UniversityRow, 'id' | 'created_at'>>;

/* ---- Documents ---- */
export interface DocumentRow {
  id: string;
  name: string;
  category: DocumentCategoryDB;
  status: DocumentStatusDB;
  student_name: string;
  student_id: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  expiry_date: string | null;
  owner_id: string;
  uploaded_at: string;
}
export type DocumentInsert = Omit<DocumentRow, 'id' | 'uploaded_at'>;
export type DocumentUpdate = Partial<Omit<DocumentRow, 'id' | 'uploaded_at'>>;

/* ---- Support Tickets ---- */
export interface SupportTicketRow {
  id: string;
  subject: string;
  description: string;
  status: TicketStatusDB;
  priority: TicketPriorityDB;
  owner_id: string;
  created_at: string;
  updated_at: string;
}
export type SupportTicketInsert = Omit<SupportTicketRow, 'id' | 'created_at' | 'updated_at'>;
export type SupportTicketUpdate = Partial<Omit<SupportTicketRow, 'id' | 'created_at'>>;

/* ---- Ticket Responses ---- */
export interface TicketResponseRow {
  id: string;
  ticket_id: string;
  message: string;
  author_id: string;
  author_name: string;
  created_at: string;
}
export type TicketResponseInsert = Omit<TicketResponseRow, 'id' | 'created_at'>;

/* ---- Company Settings ---- */
export interface CompanySettingsRow {
  id: string;
  company_name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  founded: string;
  updated_at: string;
}
export type CompanySettingsUpdate = Partial<Omit<CompanySettingsRow, 'id' | 'updated_at'>>;

/* ---- Notification Preferences ---- */
export interface NotificationPreferencesRow {
  id: string;
  user_id: string;
  new_lead_assigned: boolean;
  application_status_update: boolean;
  document_uploaded_verified: boolean;
  visa_decision_received: boolean;
  follow_up_due_today: boolean;
  weekly_performance_report: boolean;
  updated_at: string;
}
export type NotificationPreferencesUpdate = Partial<
  Omit<NotificationPreferencesRow, 'id' | 'user_id' | 'updated_at'>
>;

/* ---- Team Members (view over profiles) ---- */
export interface TeamMemberRow {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  status: 'active' | 'pending';
  joined_at: string;
}

/* ============================================================
 * Supabase Database type map (for createClient<Database>)
 * ============================================================ */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
      applications: {
        Row: ApplicationRow;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
      };
      universities: {
        Row: UniversityRow;
        Insert: UniversityInsert;
        Update: UniversityUpdate;
      };
      documents: {
        Row: DocumentRow;
        Insert: DocumentInsert;
        Update: DocumentUpdate;
      };
      support_tickets: {
        Row: SupportTicketRow;
        Insert: SupportTicketInsert;
        Update: SupportTicketUpdate;
      };
      ticket_responses: {
        Row: TicketResponseRow;
        Insert: TicketResponseInsert;
        Update: Partial<TicketResponseInsert>;
      };
      company_settings: {
        Row: CompanySettingsRow;
        Insert: Omit<CompanySettingsRow, 'updated_at'>;
        Update: CompanySettingsUpdate;
      };
      notification_preferences: {
        Row: NotificationPreferencesRow;
        Insert: Omit<NotificationPreferencesRow, 'id' | 'updated_at'>;
        Update: NotificationPreferencesUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lead_status: LeadStatusDB;
      application_status: ApplicationStatusDB;
      document_category: DocumentCategoryDB;
      document_status: DocumentStatusDB;
      ticket_status: TicketStatusDB;
      ticket_priority: TicketPriorityDB;
    };
  };
}
