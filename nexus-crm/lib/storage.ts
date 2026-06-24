import type { CrmData } from '@/types';

export function getDefaultSettings() {
  return {
    companyProfile: {
      companyName: '',
      address: '',
      email: '',
      phone: '',
      website: '',
      founded: '',
    },
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
    teamMembers: [],
    notificationPreferences: {
      newLeadAssigned: false,
      applicationStatusUpdate: false,
      documentUploadedVerified: false,
      visaDecisionReceived: false,
      followUpDueToday: false,
      weeklyPerformanceReport: false,
    },
    supportTickets: [],
  };
}

export function getDefaultCrmData(): CrmData {
  return {
    leads: [],
    applications: [],
    universities: [],
    documents: [],
    counselors: [],
    settings: getDefaultSettings(),
  };
}
