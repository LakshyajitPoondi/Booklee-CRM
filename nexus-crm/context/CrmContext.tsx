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
import { useAuth } from '@/context/AuthContext';
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
  SupportTicket,
  TeamMember,
  University,
  User,
} from '@/types';
import { getDefaultCrmData } from '@/lib/storage';
import { generateId, isOverdue, isToday, isWithinDays } from '@/lib/utils';
import * as leadsService from '@/services/leads';
import * as applicationsService from '@/services/applications';
import * as universitiesService from '@/services/universities';
import * as documentsService from '@/services/documents';
import * as settingsService from '@/services/settings';
import * as ticketsService from '@/services/tickets';
import { uploadAvatar } from '@/services/storage';

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
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>, file?: File) => Document;
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
  uploadProfileAvatar: (file: File) => Promise<string>;
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<CrmData>(getDefaultCrmData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive user from auth context
  const user: User = useMemo(
    () =>
      authUser
        ? {
            id: authUser.id,
            name: authUser.fullName,
            role: authUser.role,
            email: authUser.email,
            avatarInitial: authUser.avatarInitial,
          }
        : {
            id: '',
            name: 'Guest',
            role: 'client',
            email: '',
            avatarInitial: 'G',
          },
    [authUser]
  );

  // Load data from Supabase on mount
  useEffect(() => {
    if (authLoading || !authUser) return;

    let cancelled = false;

    async function loadAll() {
      try {
        const [leads, applications, universities, docs, companySettings, notifPrefs, tickets, teamMembers] =
          await Promise.all([
            leadsService.getLeads().catch(() => []),
            applicationsService.getApplications().catch(() => []),
            universitiesService.getUniversities().catch(() => []),
            documentsService.getDocuments().catch(() => []),
            settingsService.getCompanySettings().catch(() => null),
            settingsService.getNotificationPreferences(authUser!.id).catch(() => null),
            ticketsService.getTickets().catch(() => []),
            settingsService.getTeamMembers().catch(() => []),
          ]);

        if (cancelled) return;

        // Map DB rows to frontend types
        const mappedLeads: Lead[] = leads.map((l) => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          status: l.status as LeadStatus,
          source: l.source,
          country: l.country,
          value: Number(l.value),
          counselorId: l.counselor_id ?? '',
          group: l.group_name,
          notes: l.notes,
          createdAt: l.created_at,
          updatedAt: l.updated_at,
          followUpDate: l.follow_up_date ?? undefined,
        }));

        const mappedApps: Application[] = applications.map((a) => ({
          id: a.id,
          studentName: a.student_name,
          studentEmail: a.student_email,
          universityId: a.university_id ?? '',
          course: a.course,
          status: a.status as ApplicationStatus,
          deadline: a.deadline,
          fee: Number(a.fee),
          intake: a.intake,
          createdAt: a.created_at,
          updatedAt: a.updated_at,
        }));

        const mappedUnis: University[] = universities.map((u) => ({
          id: u.id,
          name: u.name,
          country: u.country,
          city: u.city,
          intake: u.intake,
          acceptanceRate: Number(u.acceptance_rate),
          activeApplications: Number(u.active_applications),
          partnerSince: u.partner_since,
          contactEmail: u.contact_email,
          website: u.website,
          createdAt: u.created_at,
        }));

        const mappedDocs: Document[] = docs.map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          status: d.status,
          studentName: d.student_name,
          studentId: d.student_id,
          fileType: d.file_type,
          fileSize: Number(d.file_size),
          uploadedAt: d.uploaded_at,
          expiryDate: d.expiry_date ?? undefined,
          storagePath: d.storage_path,
        }));

        const mappedTeam: TeamMember[] = teamMembers.map((m) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: m.role === 'super_admin' ? 'Admin' : m.role === 'admin' ? 'Admin' : m.role === 'staff' ? 'Counselor' : 'Viewer',
          status: 'active' as const,
          joinedAt: m.created_at,
          avatarInitial: m.full_name.charAt(0).toUpperCase(),
        }));

        const mappedTickets: SupportTicket[] = await Promise.all(
          tickets.map(async (t) => {
            const responses = await ticketsService.getTicketResponses(t.id).catch(() => []);
            return {
              id: t.id,
              subject: t.subject,
              description: t.description,
              status: t.status,
              priority: t.priority,
              createdAt: t.created_at,
              updatedAt: t.updated_at,
              responses: responses.map((r) => ({
                id: r.id,
                message: r.message,
                author: r.author_name,
                createdAt: r.created_at,
              })),
            };
          })
        );

        setData({
          leads: mappedLeads,
          applications: mappedApps,
          universities: mappedUnis,
          documents: mappedDocs,
          counselors: [
            {
              id: authUser!.id,
              name: authUser!.fullName,
              avatarInitial: authUser!.avatarInitial,
              converted: 0,
              rate: 0,
            },
          ],
          settings: {
            companyProfile: companySettings
              ? {
                  companyName: companySettings.company_name,
                  address: companySettings.address,
                  email: companySettings.email,
                  phone: companySettings.phone,
                  website: companySettings.website,
                  founded: companySettings.founded,
                }
              : getDefaultCrmData().settings.companyProfile,
            personalInfo: {
              name: authUser!.fullName,
              email: authUser!.email,
              phone: authUser!.phone ?? '',
              role: authUser!.role,
            },
            teamMembers: mappedTeam,
            notificationPreferences: notifPrefs
              ? {
                  newLeadAssigned: notifPrefs.new_lead_assigned,
                  applicationStatusUpdate: notifPrefs.application_status_update,
                  documentUploadedVerified: notifPrefs.document_uploaded_verified,
                  visaDecisionReceived: notifPrefs.visa_decision_received,
                  followUpDueToday: notifPrefs.follow_up_due_today,
                  weeklyPerformanceReport: notifPrefs.weekly_performance_report,
                }
              : getDefaultCrmData().settings.notificationPreferences,
            supportTickets: mappedTickets,
          },
        });
      } catch {
        // Supabase not configured yet — use defaults
      }
      if (!cancelled) setIsLoaded(true);
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading]);

  // --- LEAD CRUD ---
  const addLead = useCallback(
    (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const tempId = generateId();
      const newLead: Lead = { ...lead, id: tempId, createdAt: now, updatedAt: now };
      setData((prev) => ({ ...prev, leads: [...prev.leads, newLead] }));

      // Persist to Supabase
      if (authUser) {
        leadsService
          .createLead({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            status: lead.status,
            source: lead.source,
            country: lead.country,
            value: lead.value,
            counselor_id: lead.counselorId || null,
            group_name: lead.group,
            notes: lead.notes,
            follow_up_date: lead.followUpDate ?? null,
            owner_id: authUser.id,
            assigned_to: null,
          })
          .then((saved) => {
            setData((prev) => ({
              ...prev,
              leads: prev.leads.map((l) =>
                l.id === tempId
                  ? {
                      ...l,
                      id: saved.id,
                      createdAt: saved.created_at,
                      updatedAt: saved.updated_at,
                    }
                  : l
              ),
            }));
          })
          .catch(() => {});
      }
      return newLead;
    },
    [authUser]
  );

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
      ),
    }));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.country !== undefined) dbUpdates.country = updates.country;
    if (updates.value !== undefined) dbUpdates.value = updates.value;
    if (updates.counselorId !== undefined) dbUpdates.counselor_id = updates.counselorId || null;
    if (updates.group !== undefined) dbUpdates.group_name = updates.group;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.followUpDate !== undefined) dbUpdates.follow_up_date = updates.followUpDate ?? null;

    if (Object.keys(dbUpdates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      leadsService.updateLead(id, dbUpdates as any).catch(() => {});
    }
  }, []);

  const deleteLead = useCallback((id: string) => {
    setData((prev) => ({ ...prev, leads: prev.leads.filter((l) => l.id !== id) }));
    leadsService.deleteLead(id).catch(() => {});
  }, []);

  // --- APPLICATION CRUD ---
  const addApplication = useCallback(
    (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const tempId = generateId();
      const newApp: Application = { ...app, id: tempId, createdAt: now, updatedAt: now };
      setData((prev) => ({ ...prev, applications: [...prev.applications, newApp] }));

      if (authUser) {
        applicationsService
          .createApplication({
            student_name: app.studentName,
            student_email: app.studentEmail,
            university_id: app.universityId || null,
            course: app.course,
            status: app.status,
            deadline: app.deadline,
            fee: app.fee,
            intake: app.intake,
            owner_id: authUser.id,
          })
          .then((saved) => {
            setData((prev) => ({
              ...prev,
              applications: prev.applications.map((a) =>
                a.id === tempId
                  ? { ...a, id: saved.id, createdAt: saved.created_at, updatedAt: saved.updated_at }
                  : a
              ),
            }));
          })
          .catch(() => {});
      }
      return newApp;
    },
    [authUser]
  );

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    }));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.studentName !== undefined) dbUpdates.student_name = updates.studentName;
    if (updates.studentEmail !== undefined) dbUpdates.student_email = updates.studentEmail;
    if (updates.universityId !== undefined) dbUpdates.university_id = updates.universityId || null;
    if (updates.course !== undefined) dbUpdates.course = updates.course;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.fee !== undefined) dbUpdates.fee = updates.fee;
    if (updates.intake !== undefined) dbUpdates.intake = updates.intake;

    if (Object.keys(dbUpdates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applicationsService.updateApplication(id, dbUpdates as any).catch(() => {});
    }
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setData((prev) => ({ ...prev, applications: prev.applications.filter((a) => a.id !== id) }));
    applicationsService.deleteApplication(id).catch(() => {});
  }, []);

  const moveApplication = useCallback(
    (id: string, status: ApplicationStatus) => {
      updateApplication(id, { status });
    },
    [updateApplication]
  );

  // --- UNIVERSITY CRUD ---
  const addUniversity = useCallback((uni: Omit<University, 'id' | 'createdAt'>) => {
    const tempId = generateId();
    const newUni: University = { ...uni, id: tempId, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, universities: [...prev.universities, newUni] }));

    universitiesService
      .createUniversity({
        name: uni.name,
        country: uni.country,
        city: uni.city,
        intake: uni.intake,
        acceptance_rate: uni.acceptanceRate,
        active_applications: uni.activeApplications,
        partner_since: uni.partnerSince,
        contact_email: uni.contactEmail,
        website: uni.website,
      })
      .then((saved) => {
        setData((prev) => ({
          ...prev,
          universities: prev.universities.map((u) =>
            u.id === tempId ? { ...u, id: saved.id, createdAt: saved.created_at } : u
          ),
        }));
      })
      .catch(() => {});
    return newUni;
  }, []);

  const updateUniversity = useCallback((id: string, updates: Partial<University>) => {
    setData((prev) => ({
      ...prev,
      universities: prev.universities.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.country !== undefined) dbUpdates.country = updates.country;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.intake !== undefined) dbUpdates.intake = updates.intake;
    if (updates.acceptanceRate !== undefined) dbUpdates.acceptance_rate = updates.acceptanceRate;
    if (updates.activeApplications !== undefined) dbUpdates.active_applications = updates.activeApplications;
    if (updates.partnerSince !== undefined) dbUpdates.partner_since = updates.partnerSince;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.website !== undefined) dbUpdates.website = updates.website;

    if (Object.keys(dbUpdates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      universitiesService.updateUniversity(id, dbUpdates as any).catch(() => {});
    }
  }, []);

  const deleteUniversity = useCallback((id: string) => {
    setData((prev) => ({ ...prev, universities: prev.universities.filter((u) => u.id !== id) }));
    universitiesService.deleteUniversity(id).catch(() => {});
  }, []);

  // --- DOCUMENT CRUD ---
  const addDocument = useCallback(
    (doc: Omit<Document, 'id' | 'uploadedAt'>, file?: File) => {
      const tempId = generateId();
      const newDoc: Document = { ...doc, id: tempId, uploadedAt: new Date().toISOString() };
      setData((prev) => ({ ...prev, documents: [...prev.documents, newDoc] }));

      if (file && authUser) {
        documentsService
          .uploadDocument(file, {
            name: doc.name,
            category: doc.category,
            status: doc.status,
            student_name: doc.studentName,
            student_id: doc.studentId,
            owner_id: authUser.id,
            expiry_date: doc.expiryDate ?? null,
          })
          .then((saved) => {
            setData((prev) => ({
              ...prev,
              documents: prev.documents.map((d) =>
                d.id === tempId
                  ? {
                      ...d,
                      id: saved.id,
                      uploadedAt: saved.uploaded_at,
                      storagePath: saved.storage_path,
                    }
                  : d
              ),
            }));
          })
          .catch(() => {});
      }
      return newDoc;
    },
    [authUser]
  );

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.studentName !== undefined) dbUpdates.student_name = updates.studentName;

    if (Object.keys(dbUpdates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      documentsService.updateDocument(id, dbUpdates as any).catch(() => {});
    }
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
    documentsService.deleteDocument(id).catch(() => {});
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
    settingsService
      .updateCompanySettings({
        company_name: profile.companyName,
        address: profile.address,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        founded: profile.founded,
      })
      .catch(() => {});
  }, []);

  const updatePersonalInfo = useCallback(
    (info: PersonalInfo) => {
      setData((prev) => ({
        ...prev,
        settings: { ...prev.settings, personalInfo: info },
      }));
      if (authUser) {
        settingsService
          .updateProfile(authUser.id, {
            full_name: info.name,
            phone: info.phone || null,
          })
          .catch(() => {});
      }
    },
    [authUser]
  );

  const updateNotificationPreferences = useCallback(
    (prefs: NotificationPreferences) => {
      setData((prev) => ({
        ...prev,
        settings: { ...prev.settings, notificationPreferences: prefs },
      }));
      if (authUser) {
        settingsService
          .updateNotificationPreferences(authUser.id, {
            new_lead_assigned: prefs.newLeadAssigned,
            application_status_update: prefs.applicationStatusUpdate,
            document_uploaded_verified: prefs.documentUploadedVerified,
            visa_decision_received: prefs.visaDecisionReceived,
            follow_up_due_today: prefs.followUpDueToday,
            weekly_performance_report: prefs.weeklyPerformanceReport,
          })
          .catch(() => {});
      }
    },
    [authUser]
  );

  const addTeamMember = useCallback(
    (member: { name: string; email: string; role: TeamMember['role'] }) => {
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
      // Note: actual team invitation would need an invite flow via Supabase Auth
      // For now, the team member list reflects profiles with non-client roles
    },
    []
  );

  const removeTeamMember = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        teamMembers: prev.settings.teamMembers.filter((m) => m.id !== id),
      },
    }));
    settingsService.removeMember(id).catch(() => {});
  }, []);

  const addTicket = useCallback(
    (ticket: { subject: string; description: string; priority: SupportTicket['priority'] }) => {
      const now = new Date().toISOString();
      const tempId = generateId();
      const newTicket: SupportTicket = {
        id: tempId,
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

      if (authUser) {
        ticketsService
          .createTicket({
            subject: ticket.subject,
            description: ticket.description,
            status: 'open',
            priority: ticket.priority,
            owner_id: authUser.id,
          })
          .then((saved) => {
            setData((prev) => ({
              ...prev,
              settings: {
                ...prev.settings,
                supportTickets: prev.settings.supportTickets.map((t) =>
                  t.id === tempId
                    ? { ...t, id: saved.id, createdAt: saved.created_at, updatedAt: saved.updated_at }
                    : t
                ),
              },
            }));
          })
          .catch(() => {});
      }
    },
    [authUser]
  );

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

    const dbUpdates: Record<string, unknown> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

    if (Object.keys(dbUpdates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ticketsService.updateTicket(id, dbUpdates as any).catch(() => {});
    }
  }, []);

  const addTicketResponse = useCallback(
    (ticketId: string, message: string) => {
      const newResponse = {
        id: generateId(),
        message,
        author: authUser?.fullName ?? 'You',
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

      if (authUser) {
        ticketsService
          .addTicketResponse({
            ticket_id: ticketId,
            message,
            author_id: authUser.id,
            author_name: authUser.fullName,
          })
          .catch(() => {});
      }
    },
    [authUser]
  );

  const uploadProfileAvatar = useCallback(
    async (file: File) => {
      if (!authUser) throw new Error('Not authenticated');
      const url = await uploadAvatar(authUser.id, file);
      await settingsService.updateProfile(authUser.id, { avatar_url: url });
      return url;
    },
    [authUser]
  );

  const value = useMemo(
    () => ({
      user,
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
      uploadProfileAvatar,
    }),
    [
      user,
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
      uploadProfileAvatar,
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

  const pipelineCounts = (
    [
      'new_lead',
      'contacted',
      'follow_up',
      'qualified',
      'application_started',
      'documentation',
      'submission',
      'approved',
      'rejected',
      'converted',
      'lost',
    ] as LeadStatus[]
  ).reduce(
    (acc, stage) => {
      acc[stage] = data.leads.filter((l) => l.status === stage).length;
      return acc;
    },
    {} as Record<LeadStatus, number>
  );

  const maxPipeline = Math.max(...Object.values(pipelineCounts), 1);

  const overdueFollowUps = data.leads.filter(
    (l) =>
      l.followUpDate &&
      isOverdue(l.followUpDate) &&
      !['converted', 'lost', 'closed', 'closed_lost'].includes(l.status)
  ).length;

  const followUpsDueToday = data.leads.filter(
    (l) =>
      l.followUpDate &&
      isToday(l.followUpDate) &&
      !['converted', 'lost', 'closed', 'closed_lost'].includes(l.status)
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
