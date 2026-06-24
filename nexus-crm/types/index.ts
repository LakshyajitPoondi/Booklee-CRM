export type LeadStatus =
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

export type ApplicationStatus =
  | 'application_started'
  | 'documentation'
  | 'submission'
  | 'approved'
  | 'visa_filing';

export type DocumentCategory =
  | 'passport'
  | 'transcript'
  | 'sop'
  | 'lor'
  | 'financial'
  | 'test_score'
  | 'visa';

export type DocumentStatus = 'verified' | 'pending_review' | 'expired';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarInitial: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  country: string;
  value: number;
  counselorId: string;
  group: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  followUpDate?: string;
}

export interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  universityId: string;
  course: string;
  status: ApplicationStatus;
  deadline: string;
  fee: number;
  intake: string;
  createdAt: string;
  updatedAt: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  intake: string[];
  acceptanceRate: number;
  activeApplications: number;
  partnerSince: string;
  contactEmail: string;
  website: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  studentName: string;
  studentId: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  expiryDate?: string;
  dataUrl?: string;
  storagePath?: string;
}

export interface Counselor {
  id: string;
  name: string;
  avatarInitial: string;
  converted: number;
  rate: number;
}

// Settings types

export interface CompanyProfile {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  founded: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Counselor' | 'Viewer';
  status: 'active' | 'pending';
  joinedAt: string;
  avatarInitial: string;
}

export interface NotificationPreferences {
  newLeadAssigned: boolean;
  applicationStatusUpdate: boolean;
  documentUploadedVerified: boolean;
  visaDecisionReceived: boolean;
  followUpDueToday: boolean;
  weeklyPerformanceReport: boolean;
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface SettingsData {
  companyProfile: CompanyProfile;
  personalInfo: PersonalInfo;
  teamMembers: TeamMember[];
  notificationPreferences: NotificationPreferences;
  supportTickets: SupportTicket[];
}

export interface CrmData {
  leads: Lead[];
  applications: Application[];
  universities: University[];
  documents: Document[];
  counselors: Counselor[];
  settings: SettingsData;
}

export type DateRange = '7' | '30' | '90';

export type LeadsView = 'list' | 'board' | 'pipeline' | 'groups';
