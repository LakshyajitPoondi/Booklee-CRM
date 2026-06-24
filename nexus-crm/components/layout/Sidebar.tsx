'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, CLIENT_NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { hasPermission, type Permission } from '@/lib/permissions/roles';

// Map nav items to required permissions
const NAV_PERMISSIONS: Record<string, Permission | null> = {
  dashboard: 'dashboard:view',
  leads: 'leads:read',
  applications: 'applications:read',
  universities: 'universities:read',
  documents: 'documents:read',
  settings: 'settings:read',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
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

  // Use client-specific nav items for client role, otherwise filter admin items by permissions
  const baseNavItems = user?.role === 'client' ? CLIENT_NAV_ITEMS : NAV_ITEMS;
  const visibleNavItems = baseNavItems.filter((item) => {
    const perm = NAV_PERMISSIONS[item.key];
    if (!perm || !user) return true;
    return hasPermission(user.role, perm);
  });

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
  };

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
          {visibleNavItems.map((item) => {
            const currentHref = user?.role === 'client' ? `/client${item.href}` : `/admin${item.href}`;
            const active = pathname === currentHref || pathname.startsWith(currentHref + '/');
            return (
              <Link
                key={item.key}
                href={currentHref}
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
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-9 h-9 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#15803d] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-medium">{user?.avatarInitial ?? 'G'}</span>
              </div>
            )}
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{user?.fullName ?? 'Guest'}</p>
                  <p className="text-xs text-[#6B7280] truncate">{user?.role ?? ''}</p>
                </div>
                <span className="material-symbols-outlined text-[#6B7280] text-lg">expand_more</span>
              </>
            )}
          </button>

          {profileOpen && !collapsed && (
            <div className="absolute bottom-20 left-3 right-3 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-[#F3F4F6]">
                <p className="text-sm font-medium text-[#111827]">{user?.fullName ?? 'Guest'}</p>
                <p className="text-xs text-[#6B7280]">{user?.email ?? ''}</p>
              </div>
              <button
                onClick={handleSignOut}
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
