'use client';

import type { Lead } from '@/types';
import { LEAD_GROUPS, LEAD_STATUS_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface LeadsGroupsViewProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}

export default function LeadsGroupsView({ leads, onEdit }: LeadsGroupsViewProps) {
  return (
    <div className="space-y-4">
      {LEAD_GROUPS.map((groupName) => {
        const groupLeads = leads.filter((l) => l.group === groupName);
        return (
          <div key={groupName} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">{groupName}</h3>
              <span className="text-xs text-[#6B7280]">{groupLeads.length} leads</span>
            </div>
            {groupLeads.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] text-center py-6">No leads in this group</p>
            ) : (
              <div className="divide-y divide-[#F3F4F6]">
                {groupLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => onEdit(lead)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#F9FAFB] cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{lead.name}</p>
                      <p className="text-xs text-[#6B7280]">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#F3F4F6] text-[#374151]">
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                      <span className="text-sm text-[#374151]">{formatCurrency(lead.value)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
