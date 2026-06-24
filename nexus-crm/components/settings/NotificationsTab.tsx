'use client';

import { useCrm } from '@/context/CrmContext';
import type { NotificationPreferences } from '@/types';
import Toggle from '@/components/ui/Toggle';

const NOTIFICATION_ITEMS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: 'newLeadAssigned', label: 'New lead assigned to me', description: 'Get notified when a lead is assigned to your account' },
  { key: 'applicationStatusUpdate', label: 'Application status update', description: "When a student's application status changes at any stage" },
  { key: 'documentUploadedVerified', label: 'Document uploaded / verified', description: 'When a student uploads or a document is verified' },
  { key: 'visaDecisionReceived', label: 'Visa decision received', description: 'Immediately when a visa is approved or rejected' },
  { key: 'followUpDueToday', label: 'Reminder: Follow-up due today', description: 'Daily digest of leads with follow-up due' },
  { key: 'weeklyPerformanceReport', label: 'Weekly performance report', description: 'Summary of your pipeline performance every Monday' },
];

export default function NotificationsTab() {
  const { data, updateNotificationPreferences } = useCrm();
  const prefs = data.settings.notificationPreferences;

  const handleToggle = (key: keyof NotificationPreferences) => {
    updateNotificationPreferences({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#111827]">Notification Preferences</h3>
        <p className="text-sm text-[#6B7280] mt-0.5">Choose which events trigger a notification for you</p>
      </div>

      <div className="divide-y divide-[#F3F4F6]">
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-[#111827]">{item.label}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => handleToggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}
