'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { useCrm } from '@/context/CrmContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useCrm();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white border border-[#E5E7EB] lg:hidden"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[#111827]">menu</span>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-[#E5E7EB] flex flex-col z-40 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 px-4 py-5 border-b border-[#F3F4F6]', collapsed && 'justify-center px-2')}>
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-[#111827] text-[15px]">{APP_NAME}</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'p-1 rounded hover:bg-[#F5F6F8] cursor-pointer hidden lg:flex',
              collapsed ? 'mx-auto' : 'ml-auto'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[#6B7280] text-lg">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#F3F4F6] text-[#111827]'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-[#F3F4F6]" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={cn(
              'w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer',
              collapsed && 'justify-center'
            )}
          >
            <div className="w-9 h-9 rounded-full bg-[#15803d] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-medium">{user.avatarInitial}</span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{user.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{user.role}</p>
                </div>
                <span className="material-symbols-outlined text-[#6B7280] text-lg">expand_more</span>
              </>
            )}
          </button>

          {profileOpen && !collapsed && (
            <div className="absolute bottom-20 left-3 right-3 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-[#F3F4F6]">
                <p className="text-sm font-medium text-[#111827]">{user.name}</p>
                <p className="text-xs text-[#6B7280]">{user.email}</p>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F9FAFB] cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
