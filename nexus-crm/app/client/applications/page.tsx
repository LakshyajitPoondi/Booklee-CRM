'use client';

import { useCrm } from '@/context/CrmContext';
import { APPLICATION_STAGES } from '@/lib/constants';
import { formatShortDate, formatCurrency } from '@/lib/utils';

export default function ClientApplicationsPage() {
  const { data, isLoaded } = useCrm();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">My Applications</h1>
        <p className="text-sm text-[#6B7280] mt-1">Track your application progress.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] card-shadow overflow-hidden">
        {data.applications.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-12">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Deadline</th>
                  <th className="px-5 py-3 font-medium">Fee</th>
                  <th className="px-5 py-3 font-medium">Intake</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((app) => (
                  <tr key={app.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="px-5 py-4 font-medium text-[#111827]">{app.course}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                        {APPLICATION_STAGES.find((s) => s.key === app.status)?.label ?? app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#374151]">{formatShortDate(app.deadline)}</td>
                    <td className="px-5 py-4 text-[#374151]">{formatCurrency(app.fee)}</td>
                    <td className="px-5 py-4 text-[#374151]">{app.intake}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
