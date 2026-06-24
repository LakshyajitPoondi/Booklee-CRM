'use client';

import { useDashboardStats } from '@/context/CrmContext';

interface NeedsAttentionProps {
  dateRange: number;
}

export default function NeedsAttention({ dateRange }: NeedsAttentionProps) {
  const { overdueFollowUps, followUpsDueToday, documentsPending } = useDashboardStats(dateRange);

  const items = [
    { label: 'Overdue follow-ups', count: overdueFollowUps, icon: 'schedule', color: '#dc2626', bg: '#fef2f2' },
    { label: 'Follow-ups due today', count: followUpsDueToday, icon: 'schedule', color: '#ea580c', bg: '#fff7ed' },
    { label: 'Documents pending', count: documentsPending, icon: 'description', color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow h-full">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#111827]">Needs attention</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">Items requiring action today.</p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <span className="material-symbols-outlined text-lg" style={{ color: item.color }}>
                  {item.icon}
                </span>
              </div>
              <span className="text-sm text-[#374151]">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-[#111827]">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
