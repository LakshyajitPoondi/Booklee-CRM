'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProfileTab from '@/components/settings/ProfileTab';
import TeamTab from '@/components/settings/TeamTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SupportTicketsTab from '@/components/settings/SupportTicketsTab';

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'team', label: 'Team', icon: 'group' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'tickets', label: 'Support Tickets', icon: 'confirmation_number' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard"
          className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Settings</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage your CRM configuration</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-[#111827] shadow-sm border border-[#E5E7EB]'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'tickets' && <SupportTicketsTab />}
        </div>
      </div>
    </div>
  );
}
