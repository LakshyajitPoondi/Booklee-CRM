'use client';

import { useState } from 'react';
import KpiCard from '@/components/ui/KpiCard';
import StudentPipeline from '@/components/dashboard/StudentPipeline';
import NeedsAttention from '@/components/dashboard/NeedsAttention';
import TopCounselors from '@/components/dashboard/TopCounselors';
import { useCrm, useDashboardStats } from '@/context/CrmContext';
import { formatDate, getGreeting } from '@/lib/utils';
import type { DateRange } from '@/types';

const DATE_RANGES: { value: DateRange; label: string; days: number }[] = [
  { value: '7', label: 'Last 7 days', days: 7 },
  { value: '30', label: 'Last 30 days', days: 30 },
  { value: '90', label: 'Last 90 days', days: 90 },
];

export default function DashboardPage() {
  const { user, isLoaded } = useCrm();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const days = DATE_RANGES.find((r) => r.value === dateRange)?.days ?? 30;
  const stats = useDashboardStats(days);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">{getGreeting(user.name)}</h1>
          <p className="text-sm text-[#6B7280] mt-1">{formatDate(new Date())}</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 cursor-pointer"
        >
          {DATE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total students" value={stats.totalStudents} trend="+12%" />
        <KpiCard label="Active applications" value={stats.activeApplications} trend="+8%" />
        <KpiCard label="Visa approved" value={stats.visaApproved} trend="+23%" />
        <KpiCard label="Conversion rate" value={`${stats.conversionRate.toFixed(1)}%`} trend="+5%" />
      </div>

      {/* Pipeline */}
      <StudentPipeline dateRange={days} />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NeedsAttention dateRange={days} />
        <TopCounselors />
      </div>
    </div>
  );
}
