'use client';

import type { Lead, LeadStatus } from '@/types';
import { PIPELINE_STAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface LeadsPipelineViewProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onEdit: (lead: Lead) => void;
}

export default function LeadsPipelineView({ leads, onStatusChange, onEdit }: LeadsPipelineViewProps) {
  const maxCount = Math.max(...PIPELINE_STAGES.map((s) => leads.filter((l) => l.status === s.key).length), 1);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.key);
          const width = (stageLeads.length / maxCount) * 100;
          return (
            <div key={stage.key}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-5 rounded shrink-0" style={{ backgroundColor: stage.color }} />
                <span className="text-sm font-medium text-[#374151] w-36">{stage.label}</span>
                <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${width}%`, backgroundColor: stage.color, opacity: 0.7 }}
                  />
                </div>
                <span className="text-sm font-medium text-[#111827] w-8 text-right">{stageLeads.length}</span>
              </div>
              {stageLeads.length > 0 && (
                <div className="ml-10 flex flex-wrap gap-2 mb-2">
                  {stageLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => onEdit(lead)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      <span className="font-medium text-[#111827]">{lead.name}</span>
                      <span className="text-[#6B7280]">{formatCurrency(lead.value)}</span>
                      <select
                        className="text-xs border-0 bg-transparent cursor-pointer"
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
