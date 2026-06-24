'use client';

import type { Lead, LeadStatus } from '@/types';
import { PIPELINE_STAGES, LEAD_STATUS_LABELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface LeadsBoardViewProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onEdit: (lead: Lead) => void;
}

export default function LeadsBoardView({ leads, onStatusChange, onEdit }: LeadsBoardViewProps) {
  const boardStages = PIPELINE_STAGES.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {boardStages.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.key);
        return (
          <div key={stage.key} className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4 min-h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: stage.color }} />
              <h3 className="text-sm font-semibold text-[#111827]">{stage.label}</h3>
              <span className="ml-auto text-xs text-[#6B7280] bg-white px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                {stageLeads.length}
              </span>
            </div>
            <div className="space-y-2">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-lg border border-[#E5E7EB] p-3 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => onEdit(lead)}
                >
                  <p className="text-sm font-medium text-[#111827]">{lead.name}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{lead.email}</p>
                  <p className="text-xs text-[#374151] mt-2">{formatCurrency(lead.value)}</p>
                  <select
                    className="mt-2 w-full text-xs border border-[#E5E7EB] rounded px-2 py-1 bg-white"
                    value={lead.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                  >
                    {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
              {stageLeads.length === 0 && (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No leads</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
