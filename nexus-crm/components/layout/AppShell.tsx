'use client';

import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="lg:pl-[240px] min-h-screen">
        <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-lg hover:bg-[#1f2937] transition-colors cursor-pointer z-20"
        aria-label="Open chat"
      >
        <span className="material-symbols-outlined text-xl">chat</span>
      </button>
    </div>
  );
}
