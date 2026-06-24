'use client';

import type { Lead } from '@/types';
import { LEAD_STATUS_LABELS } from '@/lib/constants';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface LeadsListViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadsListView({ leads, onEdit, onDelete }: LeadsListViewProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-[#6B7280]">
        No leads found. Create your first lead to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB]">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Email</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Country</th>
            <th className="pb-3 pr-4 font-medium">Group</th>
            <th className="pb-3 pr-4 font-medium">Value</th>
            <th className="pb-3 pr-4 font-medium">Created</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
              <td className="py-3 pr-4 font-medium text-[#111827]">{lead.name}</td>
              <td className="py-3 pr-4 text-[#374151]">{lead.email}</td>
              <td className="py-3 pr-4">
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </td>
              <td className="py-3 pr-4 text-[#374151]">{lead.country || '—'}</td>
              <td className="py-3 pr-4 text-[#374151]">{lead.group}</td>
              <td className="py-3 pr-4 text-[#374151]">{formatCurrency(lead.value)}</td>
              <td className="py-3 pr-4 text-[#6B7280]">{formatShortDate(lead.createdAt)}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(lead.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
