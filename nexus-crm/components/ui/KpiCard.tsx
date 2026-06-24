'use client';

import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export default function KpiCard({ label, value, trend, trendUp = true }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 card-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280] mb-1">{label}</p>
          <p className="text-2xl font-semibold text-[#111827]">{value}</p>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 mt-2 text-xs font-medium px-1.5 py-0.5 rounded',
                trendUp ? 'text-[#15803d] bg-[#f0fdf4]' : 'text-[#dc2626] bg-[#fef2f2]'
              )}
            >
              <span className="material-symbols-outlined text-xs">{trendUp ? 'arrow_upward' : 'arrow_downward'}</span>
              {trend}
            </span>
          )}
        </div>
        <div className="w-16 h-8 flex items-end gap-0.5 opacity-40">
          {[3, 5, 4, 7, 5, 8, 6].map((h, i) => (
            <div key={i} className="flex-1 bg-[#d1d5db] rounded-sm" style={{ height: `${h * 3}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
