'use client';

import Link from 'next/link';
import { useCrm } from '@/context/CrmContext';

export default function TopCounselors() {
  const { data } = useCrm();

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#111827]">Top counselors</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">This month&apos;s performance.</p>
        </div>
        <Link href="/leads" className="text-sm text-[#2563eb] hover:underline font-medium">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#6B7280] border-b border-[#F3F4F6]">
              <th className="pb-3 font-medium">Counselor</th>
              <th className="pb-3 font-medium">Converted</th>
              <th className="pb-3 font-medium">Rate</th>
              <th className="pb-3 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody>
            {data.counselors.map((counselor) => (
              <tr key={counselor.id} className="border-b border-[#F9FAFB] last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#15803d] flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{counselor.avatarInitial}</span>
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2563eb] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                        1
                      </span>
                    </div>
                    <span className="font-medium text-[#111827]">{counselor.name}</span>
                  </div>
                </td>
                <td className="py-3 text-[#374151]">{counselor.converted}</td>
                <td className="py-3 text-[#374151]">{counselor.rate}%</td>
                <td className="py-3">
                  <div className="w-20 h-6 flex items-end gap-0.5 opacity-40">
                    {[2, 4, 3, 5, 4, 6, 5].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#d1d5db] rounded-sm" style={{ height: `${h * 3}px` }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
