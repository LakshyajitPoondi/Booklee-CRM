'use client';

import { useCrm, useDashboardStats } from '@/context/CrmContext';
import KpiCard from '@/components/ui/KpiCard';
import { getGreeting, formatDate } from '@/lib/utils';

export default function ClientDashboard() {
  const { user, isLoaded, data } = useCrm();
  const stats = useDashboardStats(30);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">{getGreeting(user.name)}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{formatDate(new Date())}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="My applications" value={data.applications.length} />
        <KpiCard label="My documents" value={data.documents.length} />
        <KpiCard label="Open tickets" value={data.settings.supportTickets.filter((t) => t.status !== 'closed').length} />
        <KpiCard label="Pending review" value={data.documents.filter((d) => d.status === 'pending_review').length} />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <h2 className="text-base font-semibold text-[#111827] mb-4">Recent Applications</h2>
        {data.applications.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-6">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {data.applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{app.course}</p>
                  <p className="text-xs text-[#6B7280]">{app.intake}</p>
                </div>
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                  {app.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
