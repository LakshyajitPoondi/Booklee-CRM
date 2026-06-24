import type { CrmData } from '@/types';

const STORAGE_KEY = 'unijourney-crm-data';

export function loadCrmData(): CrmData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CrmData;
    // Ensure settings field exists for older stored data
    if (!data.settings) {
      data.settings = getDefaultSettings();
    }
    return data;
  } catch {
    return null;
  }
}

export function saveCrmData(data: CrmData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

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
      name: 'Alwin',
      email: 'alwinkishorea@gmail.com',
      phone: '+91 98765 43210',
      role: 'Admin',
    },
    teamMembers: [
      {
        id: '1',
        name: 'Alwin',
        email: 'alwinkishorea@gmail.com',
        role: 'Admin' as const,
        status: 'active' as const,
        joinedAt: new Date().toISOString(),
        avatarInitial: 'A',
      },
    ],
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
    counselors: [
      { id: '1', name: 'Alwin', avatarInitial: 'A', converted: 0, rate: 0 },
    ],
    settings: getDefaultSettings(),
  };
}
