'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Application,
  ApplicationStatus,
  CompanyProfile,
  Counselor,
  CrmData,
  Document,
  Lead,
  LeadStatus,
  NotificationPreferences,
  PersonalInfo,
  SettingsData,
  SupportTicket,
  TeamMember,
  University,
  User,
} from '@/types';
import { getDefaultCrmData } from '@/lib/storage';
import { generateId, isOverdue, isToday, isWithinDays } from '@/lib/utils';

interface CrmContextValue {
  user: User;
  data: CrmData;
  isLoaded: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Application;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  moveApplication: (id: string, status: ApplicationStatus) => void;
  addUniversity: (uni: Omit<University, 'id' | 'createdAt'>) => University;
  updateUniversity: (id: string, updates: Partial<University>) => void;
  deleteUniversity: (id: string) => void;
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  updateCounselor: (id: string, updates: Partial<Counselor>) => void;
  // Settings actions
  updateCompanyProfile: (profile: CompanyProfile) => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;
  addTeamMember: (member: { name: string; email: string; role: TeamMember['role'] }) => void;
  removeTeamMember: (id: string) => void;
  addTicket: (ticket: { subject: string; description: string; priority: SupportTicket['priority'] }) => void;
  updateTicket: (id: string, updates: Partial<SupportTicket>) => void;
  addTicketResponse: (ticketId: string, message: string) => void;
}

const CrmContext = createContext<CrmContextValue | null>(null);

const DEFAULT_USER: User = {
  id: '1',
  name: 'Alwin',
  role: 'Admin',
  email: 'alwinkishorea@gmail.com',
  avatarInitial: 'A',
};

export function CrmProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CrmData>(getDefaultCrmData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        const [leadsRes, appsRes, unisRes, docsRes, settingsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/applications'),
          fetch('/api/universities'),
          fetch('/api/documents'),
          fetch('/api/settings'),
        ]);
        if (cancelled) return;
        const [leads, applications, universities, documents, settings] = await Promise.all([
          leadsRes.json(),
          appsRes.json(),
          unisRes.json(),
          docsRes.json(),
          settingsRes.json(),
        ]);
        setData((prev) => ({
          ...prev,
          leads,
          applications,
          universities,
          documents,
          settings,
        }));
      } catch {
        // API not available, use defaults
      }
      if (!cancelled) setIsLoaded(true);
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  // --- LEAD CRUD ---
  const addLead = useCallback((lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newLead: Lead = { ...lead, id: generateId(), createdAt: now, updatedAt: now };
    setData((prev) => ({ ...prev, leads: [...prev.leads, newLead] }));
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((l) => (l.id === newLead.id ? saved : l)),
      }));
    }).catch(() => {});
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      ),
    }));
    fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const deleteLead = useCallback((id: string) => {
    setData((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }));
    fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  // --- APPLICATION CRUD ---
  const addApplication = useCallback((app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newApp: Application = { ...app, id: generateId(), createdAt: now, updatedAt: now };
    setData((prev) => ({ ...prev, applications: [...prev.applications, newApp] }));
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        applications: prev.applications.map((a) => (a.id === newApp.id ? saved : a)),
      }));
    }).catch(() => {});
    return newApp;
  }, []);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    }));
    fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setData((prev) => ({ ...prev, applications: prev.applications.filter((a) => a.id !== id) }));
    fetch(`/api/applications/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  const moveApplication = useCallback((id: string, status: ApplicationStatus) => {
    updateApplication(id, { status });
  }, [updateApplication]);

  // --- UNIVERSITY CRUD ---
  const addUniversity = useCallback((uni: Omit<University, 'id' | 'createdAt'>) => {
    const newUni: University = { ...uni, id: generateId(), createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, universities: [...prev.universities, newUni] }));
    fetch('/api/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uni),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        universities: prev.universities.map((u) => (u.id === newUni.id ? saved : u)),
      }));
    }).catch(() => {});
    return newUni;
  }, []);

  const updateUniversity = useCallback((id: string, updates: Partial<University>) => {
    setData((prev) => ({
      ...prev,
      universities: prev.universities.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
    fetch(`/api/universities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const deleteUniversity = useCallback((id: string) => {
    setData((prev) => ({ ...prev, universities: prev.universities.filter((u) => u.id !== id) }));
    fetch(`/api/universities/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  // --- DOCUMENT CRUD ---
  const addDocument = useCallback((doc: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDoc: Document = { ...doc, id: generateId(), uploadedAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, documents: [...prev.documents, newDoc] }));
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        documents: prev.documents.map((d) => (d.id === newDoc.id ? saved : d)),
      }));
    }).catch(() => {});
    return newDoc;
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
    fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
    fetch(`/api/documents/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  // --- COUNSELOR ---
  const updateCounselor = useCallback((id: string, updates: Partial<Counselor>) => {
    setData((prev) => ({
      ...prev,
      counselors: prev.counselors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  // --- SETTINGS ---
  const updateCompanyProfile = useCallback((profile: CompanyProfile) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, companyProfile: profile },
    }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyProfile: profile }),
    }).catch(() => {});
  }, []);

  const updatePersonalInfo = useCallback((info: PersonalInfo) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, personalInfo: info },
    }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalInfo: info }),
    }).catch(() => {});
  }, []);

  const updateNotificationPreferences = useCallback((prefs: NotificationPreferences) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, notificationPreferences: prefs },
    }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationPreferences: prefs }),
    }).catch(() => {});
  }, []);

  const addTeamMember = useCallback((member: { name: string; email: string; role: TeamMember['role'] }) => {
    const newMember: TeamMember = {
      id: generateId(),
      name: member.name,
      email: member.email,
      role: member.role,
      status: 'pending',
      joinedAt: new Date().toISOString(),
      avatarInitial: member.name.charAt(0).toUpperCase(),
    };
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, teamMembers: [...prev.settings.teamMembers, newMember] },
    }));
    fetch('/api/settings/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          teamMembers: prev.settings.teamMembers.map((m) => (m.id === newMember.id ? saved : m)),
        },
      }));
    }).catch(() => {});
  }, []);

  const removeTeamMember = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        teamMembers: prev.settings.teamMembers.filter((m) => m.id !== id),
      },
    }));
    fetch(`/api/settings/team/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  const addTicket = useCallback((ticket: { subject: string; description: string; priority: SupportTicket['priority'] }) => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: generateId(),
      subject: ticket.subject,
      description: ticket.description,
      status: 'open',
      priority: ticket.priority,
      createdAt: now,
      updatedAt: now,
      responses: [],
    };
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        supportTickets: [...prev.settings.supportTickets, newTicket],
      },
    }));
    fetch('/api/settings/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    }).then((r) => r.json()).then((saved) => {
      setData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          supportTickets: prev.settings.supportTickets.map((t) => (t.id === newTicket.id ? saved : t)),
        },
      }));
    }).catch(() => {});
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<SupportTicket>) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        supportTickets: prev.settings.supportTickets.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
      },
    }));
    fetch(`/api/settings/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  }, []);

  const addTicketResponse = useCallback((ticketId: string, message: string) => {
    const newResponse = {
      id: generateId(),
      message,
      author: 'You',
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        supportTickets: prev.settings.supportTickets.map((t) =>
          t.id === ticketId
            ? { ...t, responses: [...t.responses, newResponse], updatedAt: new Date().toISOString() }
            : t
        ),
      },
    }));
    fetch(`/api/settings/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newResponse: message }),
    }).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      user: DEFAULT_USER,
      data,
      isLoaded,
      addLead,
      updateLead,
      deleteLead,
      addApplication,
      updateApplication,
      deleteApplication,
      moveApplication,
      addUniversity,
      updateUniversity,
      deleteUniversity,
      addDocument,
      updateDocument,
      deleteDocument,
      updateCounselor,
      updateCompanyProfile,
      updatePersonalInfo,
      updateNotificationPreferences,
      addTeamMember,
      removeTeamMember,
      addTicket,
      updateTicket,
      addTicketResponse,
    }),
    [
      data,
      isLoaded,
      addLead,
      updateLead,
      deleteLead,
      addApplication,
      updateApplication,
      deleteApplication,
      moveApplication,
      addUniversity,
      updateUniversity,
      deleteUniversity,
      addDocument,
      updateDocument,
      deleteDocument,
      updateCounselor,
      updateCompanyProfile,
      updatePersonalInfo,
      updateNotificationPreferences,
      addTeamMember,
      removeTeamMember,
      addTicket,
      updateTicket,
      addTicketResponse,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used within CrmProvider');
  return ctx;
}

export function useLeadStats() {
  const { data } = useCrm();
  const leads = data.leads;
  const newLeads = leads.filter((l) => l.status === 'new_lead').length;
  const closed = leads.filter((l) => l.status === 'closed' || l.status === 'converted').length;
  const lost = leads.filter((l) => l.status === 'lost' || l.status === 'closed_lost').length;
  const totalClosedValue = leads
    .filter((l) => l.status === 'closed' || l.status === 'converted')
    .reduce((sum, l) => sum + l.value, 0);
  return { newLeads, closed, lost, totalClosedValue, total: leads.length };
}

export function useApplicationStats() {
  const { data } = useCrm();
  const apps = data.applications;
  const inProgress = apps.filter((a) =>
    ['application_started', 'documentation', 'submission'].includes(a.status)
  ).length;
  const offersReceived = apps.filter((a) => a.status === 'approved').length;
  const visaProcessing = apps.filter((a) => a.status === 'visa_filing').length;
  return { total: apps.length, inProgress, offersReceived, visaProcessing };
}

export function useDashboardStats(dateRange: number) {
  const { data } = useCrm();

  const filteredLeads = data.leads.filter((l) => isWithinDays(l.createdAt, dateRange));
  const filteredApps = data.applications.filter((a) => isWithinDays(a.createdAt, dateRange));

  const totalStudents = filteredLeads.filter((l) =>
    ['qualified', 'application_started', 'documentation', 'submission', 'approved', 'converted'].includes(l.status)
  ).length;

  const activeApplications = filteredApps.filter((a) =>
    ['application_started', 'documentation', 'submission'].includes(a.status)
  ).length;

  const visaApproved = filteredApps.filter((a) => a.status === 'visa_filing').length;

  const converted = filteredLeads.filter((l) => l.status === 'converted').length;
  const conversionRate = filteredLeads.length > 0 ? (converted / filteredLeads.length) * 100 : 0;

  const pipelineCounts = (['new_lead', 'contacted', 'follow_up', 'qualified', 'application_started', 'documentation', 'submission', 'approved', 'rejected', 'converted', 'lost'] as LeadStatus[]).reduce(
    (acc, stage) => {
      acc[stage] = data.leads.filter((l) => l.status === stage).length;
      return acc;
    },
    {} as Record<LeadStatus, number>
  );

  const maxPipeline = Math.max(...Object.values(pipelineCounts), 1);

  const overdueFollowUps = data.leads.filter(
    (l) => l.followUpDate && isOverdue(l.followUpDate) && !['converted', 'lost', 'closed', 'closed_lost'].includes(l.status)
  ).length;

  const followUpsDueToday = data.leads.filter(
    (l) => l.followUpDate && isToday(l.followUpDate) && !['converted', 'lost', 'closed', 'closed_lost'].includes(l.status)
  ).length;

  const documentsPending = data.documents.filter((d) => d.status === 'pending_review').length;

  return {
    totalStudents,
    activeApplications,
    visaApproved,
    conversionRate,
    pipelineCounts,
    maxPipeline,
    overdueFollowUps,
    followUpsDueToday,
    documentsPending,
  };
}

export function useUniversityStats() {
  const { data } = useCrm();
  const ukUniversities = data.universities.filter((u) => u.country === 'United Kingdom').length;
  const activeApplications = data.applications.filter((a) =>
    ['application_started', 'documentation', 'submission'].includes(a.status)
  ).length;
  const avgAcceptance =
    data.universities.length > 0
      ? data.universities.reduce((sum, u) => sum + u.acceptanceRate, 0) / data.universities.length
      : 0;
  return {
    totalPartners: data.universities.length,
    ukUniversities,
    activeApplications,
    avgAcceptance,
  };
}
