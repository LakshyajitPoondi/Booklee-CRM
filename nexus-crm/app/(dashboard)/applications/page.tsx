'use client';

import { useMemo, useState } from 'react';
import KpiCard from '@/components/ui/KpiCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ApplicationForm from '@/components/applications/ApplicationForm';
import ApplicationPipeline from '@/components/applications/ApplicationPipeline';
import { useCrm, useApplicationStats } from '@/context/CrmContext';
import { APPLICATION_STAGES } from '@/lib/constants';
import { formatCurrency, formatShortDate, exportToCsv } from '@/lib/utils';
import type { Application } from '@/types';

export default function ApplicationsPage() {
  const { data, addApplication, updateApplication, deleteApplication, moveApplication, isLoaded } = useCrm();
  const stats = useApplicationStats();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [search, setSearch] = useState('');

  const getUniversityName = (id: string) =>
    data.universities.find((u) => u.id === id)?.name ?? 'Unknown';

  const filteredApps = useMemo(() => {
    if (!search) return data.applications;
    const q = search.toLowerCase();
    return data.applications.filter(
      (a) =>
        a.studentName.toLowerCase().includes(q) ||
        a.course.toLowerCase().includes(q) ||
        (data.universities.find((u) => u.id === a.universityId)?.name ?? '').toLowerCase().includes(q)
    );
  }, [data.applications, data.universities, search]);

  const handleCreate = (formData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    addApplication(formData);
    setModalOpen(false);
  };

  const handleUpdate = (formData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingApp) {
      updateApplication(editingApp.id, formData);
      setEditingApp(null);
      setModalOpen(false);
    }
  };

  const handleExport = () => {
    exportToCsv(
      'applications.csv',
      ['Student', 'University', 'Course', 'Status', 'Deadline', 'Fee', 'Intake'],
      filteredApps.map((a) => [
        a.studentName,
        getUniversityName(a.universityId),
        a.course,
        APPLICATION_STAGES.find((s) => s.key === a.status)?.label ?? a.status,
        formatShortDate(a.deadline),
        String(a.fee),
        a.intake,
      ])
    );
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Applications</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track and manage student applications.</p>
        </div>
        <Button onClick={() => { setEditingApp(null); setModalOpen(true); }}>
          <span className="material-symbols-outlined text-lg">add</span>
          New application
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total applications" value={stats.total} trend="+6%" />
        <KpiCard label="In progress" value={stats.inProgress} trend="+4%" />
        <KpiCard label="Offers received" value={stats.offersReceived} trend="+12%" />
        <KpiCard label="Visa processing" value={stats.visaProcessing} trend="+8%" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-[#111827] mb-4">Application pipeline</h2>
        <ApplicationPipeline
          applications={filteredApps}
          getUniversityName={getUniversityName}
          onMove={moveApplication}
          onEdit={(a) => { setEditingApp(a); setModalOpen(true); }}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#111827]">All applications</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">search</span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>
            <Button variant="secondary" onClick={handleExport}>
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </Button>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-8">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB]">
                  <th className="pb-3 pr-4 font-medium">Student</th>
                  <th className="pb-3 pr-4 font-medium">University</th>
                  <th className="pb-3 pr-4 font-medium">Course</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Deadline</th>
                  <th className="pb-3 pr-4 font-medium">Fee</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{app.studentName}</td>
                    <td className="py-3 pr-4 text-[#374151]">{getUniversityName(app.universityId)}</td>
                    <td className="py-3 pr-4 text-[#374151]">{app.course}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                        {APPLICATION_STAGES.find((s) => s.key === app.status)?.label ?? app.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#374151]">{formatShortDate(app.deadline)}</td>
                    <td className="py-3 pr-4 text-[#374151]">{formatCurrency(app.fee)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingApp(app); setModalOpen(true); }}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this application?')) deleteApplication(app.id); }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingApp(null); }}
        title={editingApp ? 'Edit application' : 'New application'}
        maxWidth="max-w-xl"
      >
        <ApplicationForm
          initial={editingApp ?? undefined}
          onSubmit={editingApp ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingApp(null); }}
        />
      </Modal>
    </div>
  );
}
