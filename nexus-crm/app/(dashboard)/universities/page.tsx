'use client';

import { useMemo, useState } from 'react';
import KpiCard from '@/components/ui/KpiCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import UniversityForm from '@/components/universities/UniversityForm';
import { useCrm, useUniversityStats } from '@/context/CrmContext';
import { COUNTRIES, INTAKES } from '@/lib/constants';
import type { University } from '@/types';

export default function UniversitiesPage() {
  const { data, addUniversity, updateUniversity, deleteUniversity, isLoaded } = useCrm();
  const stats = useUniversityStats();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [intakeFilter, setIntakeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);

  const filtered = useMemo(() => {
    let result = [...data.universities];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
      );
    }
    if (countryFilter) result = result.filter((u) => u.country === countryFilter);
    if (intakeFilter) result = result.filter((u) => u.intake.includes(intakeFilter));
    return result;
  }, [data.universities, search, countryFilter, intakeFilter]);

  const handleCreate = (formData: Omit<University, 'id' | 'createdAt'>) => {
    addUniversity(formData);
    setModalOpen(false);
  };

  const handleUpdate = (formData: Omit<University, 'id' | 'createdAt'>) => {
    if (editingUni) {
      updateUniversity(editingUni.id, formData);
      setEditingUni(null);
      setModalOpen(false);
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Universities</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage partner universities and programs.</p>
        </div>
        <Button onClick={() => { setEditingUni(null); setModalOpen(true); }}>
          <span className="material-symbols-outlined text-lg">add</span>
          Add university
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total partners" value={stats.totalPartners} trend="+2" />
        <KpiCard label="UK universities" value={stats.ukUniversities} trend="+1" />
        <KpiCard label="Active applications" value={stats.activeApplications} trend="+5%" />
        <KpiCard label="Average acceptance" value={`${stats.avgAcceptance.toFixed(0)}%`} trend="+3%" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">search</span>
          <input
            type="text"
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
          />
        </div>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white cursor-pointer"
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={intakeFilter}
          onChange={(e) => setIntakeFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white cursor-pointer"
        >
          <option value="">All intakes</option>
          {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] card-shadow overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-12">No universities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-5 py-3 font-medium">University</th>
                  <th className="px-5 py-3 font-medium">Country</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Intake</th>
                  <th className="px-5 py-3 font-medium">Acceptance</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((uni) => (
                  <tr key={uni.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#111827]">{uni.name}</p>
                      {uni.website && (
                        <p className="text-xs text-[#6B7280] mt-0.5">{uni.website}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#374151]">{uni.country}</td>
                    <td className="px-5 py-4 text-[#374151]">{uni.city || '—'}</td>
                    <td className="px-5 py-4 text-[#374151]">{uni.intake.join(', ')}</td>
                    <td className="px-5 py-4 text-[#374151]">{uni.acceptanceRate}%</td>
                    <td className="px-5 py-4 text-[#374151]">{uni.activeApplications}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingUni(uni); setModalOpen(true); }}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this university?')) deleteUniversity(uni.id); }}>Delete</Button>
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
        onClose={() => { setModalOpen(false); setEditingUni(null); }}
        title={editingUni ? 'Edit university' : 'Add university'}
        maxWidth="max-w-xl"
      >
        <UniversityForm
          initial={editingUni ?? undefined}
          onSubmit={editingUni ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingUni(null); }}
        />
      </Modal>
    </div>
  );
}
