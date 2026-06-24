import type { ApplicationStatus, DocumentCategory, LeadStatus } from '@/types';

export const APP_NAME = 'UniJourney';

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { key: 'leads', label: 'Leads', icon: 'group', href: '/leads' },
  { key: 'applications', label: 'Applications', icon: 'description', href: '/applications' },
  { key: 'universities', label: 'Universities', icon: 'school', href: '/universities' },
  { key: 'documents', label: 'Documents', icon: 'folder', href: '/documents' },
  { key: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
] as const;

export const CLIENT_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { key: 'applications', label: 'Applications', icon: 'description', href: '/applications' },
  { key: 'documents', label: 'Documents', icon: 'folder', href: '/documents' },
  { key: 'profile', label: 'Profile', icon: 'person', href: '/profile' },
  { key: 'support', label: 'Support', icon: 'support_agent', href: '/support' },
] as const;

export const PIPELINE_STAGES: {
  key: LeadStatus;
  label: string;
  color: string;
}[] = [
  { key: 'new_lead', label: 'New Lead', color: '#1e3a5f' },
  { key: 'contacted', label: 'Contacted', color: '#7c3aed' },
  { key: 'follow_up', label: 'Follow-up', color: '#ea580c' },
  { key: 'qualified', label: 'Qualified', color: '#2563eb' },
  { key: 'application_started', label: 'Application Started', color: '#0891b2' },
  { key: 'documentation', label: 'Documentation', color: '#9f1239' },
  { key: 'submission', label: 'Submission', color: '#1e40af' },
  { key: 'approved', label: 'Approved', color: '#65a30d' },
  { key: 'rejected', label: 'Rejected', color: '#dc2626' },
  { key: 'converted', label: 'Converted', color: '#15803d' },
  { key: 'lost', label: 'Lost', color: '#6b7280' },
];

export const APPLICATION_STAGES: {
  key: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { key: 'application_started', label: 'Application Started', color: '#0891b2' },
  { key: 'documentation', label: 'Documentation', color: '#9f1239' },
  { key: 'submission', label: 'Submission', color: '#1e40af' },
  { key: 'approved', label: 'Approved / Offer', color: '#65a30d' },
  { key: 'visa_filing', label: 'Visa Filing', color: '#7c3aed' },
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead: 'New Lead',
  contacted: 'Contacted',
  follow_up: 'Follow-up',
  qualified: 'Qualified',
  application_started: 'Application Started',
  documentation: 'Documentation',
  submission: 'Submission',
  approved: 'Approved',
  rejected: 'Rejected',
  converted: 'Converted',
  lost: 'Lost',
  closed: 'Closed',
  closed_lost: 'Closed Lost',
};

export const DOCUMENT_CATEGORIES: { key: DocumentCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'passport', label: 'Passports' },
  { key: 'transcript', label: 'Transcripts' },
  { key: 'sop', label: 'SOP' },
  { key: 'lor', label: 'LOR' },
  { key: 'financial', label: 'Financial' },
  { key: 'test_score', label: 'Test Scores' },
  { key: 'visa', label: 'Visa' },
];

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  verified: 'Verified',
  pending_review: 'Pending Review',
  expired: 'Expired',
};

export const LEAD_GROUPS = ['Undergraduate', 'Postgraduate', 'PhD', 'Foundation', 'Other'];

export const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Ireland',
  'Germany',
  'Netherlands',
  'Other',
];

export const INTAKES = ['Jan 2026', 'May 2026', 'Sep 2026', 'Jan 2027', 'Sep 2027'];
