'use client';

import { useMemo, useState } from 'react';
import KpiCard from '@/components/ui/KpiCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LeadForm from '@/components/leads/LeadForm';
import LeadsListView from '@/components/leads/LeadsListView';
import LeadsBoardView from '@/components/leads/LeadsBoardView';
import LeadsPipelineView from '@/components/leads/LeadsPipelineView';
import LeadsGroupsView from '@/components/leads/LeadsGroupsView';
import { useCrm, useLeadStats } from '@/context/CrmContext';
import { LEAD_STATUS_LABELS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import type { Lead, LeadStatus, LeadsView } from '@/types';

const TABS: { key: LeadsView; label: string }[] = [
  { key: 'list', label: 'List' },
  { key: 'board', label: 'Board' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'groups', label: 'Groups' },
];

export default function LeadsPage() {
  const { data, addLead, updateLead, deleteLead, isLoaded } = useCrm();
  const stats = useLeadStats();
  const [view, setView] = useState<LeadsView>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'value'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    let result = [...data.leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((l) => l.status === statusFilter);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'value') cmp = a.value - b.value;
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [data.leads, search, statusFilter, sortBy, sortDir]);

  const handleCreate = (formData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    addLead(formData);
    setModalOpen(false);
  };

  const handleUpdate = (formData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingLead) {
      updateLead(editingLead.id, formData);
      setEditingLead(null);
      setModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) deleteLead(id);
  };

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Leads</h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage and track your student leads.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="New leads" value={stats.newLeads} trend="+15%" />
        <KpiCard label="Closed" value={stats.closed} trend="+10%" />
        <KpiCard label="Lost" value={stats.lost} trend="-3%" trendUp={false} />
        <KpiCard label="Total closed value" value={formatCurrency(stats.totalClosedValue)} trend="+18%" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">search</span>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white cursor-pointer"
        >
          <option value="date">Sort by date</option>
          <option value="name">Sort by name</option>
          <option value="value">Sort by value</option>
        </select>
        <button
          onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white hover:bg-[#F9FAFB] cursor-pointer"
        >
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white cursor-pointer"
        >
          <option value="">All statuses</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Button onClick={() => { setEditingLead(null); setModalOpen(true); }}>
          <span className="material-symbols-outlined text-lg">add</span>
          New lead
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer',
                view === tab.key
                  ? 'border-[#111827] text-[#111827]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View content */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 card-shadow">
        {view === 'list' && (
          <LeadsListView leads={filteredLeads} onEdit={(l) => { setEditingLead(l); setModalOpen(true); }} onDelete={handleDelete} />
        )}
        {view === 'board' && (
          <LeadsBoardView leads={filteredLeads} onStatusChange={handleStatusChange} onEdit={(l) => { setEditingLead(l); setModalOpen(true); }} />
        )}
        {view === 'pipeline' && (
          <LeadsPipelineView leads={filteredLeads} onStatusChange={handleStatusChange} onEdit={(l) => { setEditingLead(l); setModalOpen(true); }} />
        )}
        {view === 'groups' && (
          <LeadsGroupsView leads={filteredLeads} onEdit={(l) => { setEditingLead(l); setModalOpen(true); }} />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingLead(null); }}
        title={editingLead ? 'Edit lead' : 'New lead'}
        maxWidth="max-w-xl"
      >
        <LeadForm
          initial={editingLead ?? undefined}
          onSubmit={editingLead ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingLead(null); }}
        />
      </Modal>
    </div>
  );
}
