'use client';

import Link from 'next/link';
import { PIPELINE_STAGES } from '@/lib/constants';
import { useDashboardStats } from '@/context/CrmContext';
import type { LeadStatus } from '@/types';

interface StudentPipelineProps {
  dateRange: number;
}

export default function StudentPipeline({ dateRange }: StudentPipelineProps) {
  const { pipelineCounts, maxPipeline } = useDashboardStats(dateRange);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#111827]">Student pipeline</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">Current funnel across all stages.</p>
        </div>
        <Link href="/leads" className="text-sm text-[#2563eb] hover:underline font-medium">
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage) => {
          const count = pipelineCounts[stage.key as LeadStatus] ?? 0;
          const width = maxPipeline > 0 ? (count / maxPipeline) * 100 : 0;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div
                className="w-7 h-5 rounded shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-sm text-[#374151] w-36 shrink-0">{stage.label}</span>
              <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${width}%`, backgroundColor: stage.color, opacity: 0.7 }}
                />
              </div>
              <span className="text-sm font-medium text-[#111827] w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
