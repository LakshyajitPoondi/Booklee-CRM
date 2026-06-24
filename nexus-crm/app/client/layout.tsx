'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CrmProvider } from '@/context/CrmContext';
import AppShell from '@/components/layout/AppShell';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== 'client') {
      router.replace('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-sm text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <CrmProvider>
      <AppShell>{children}</AppShell>
    </CrmProvider>
  );
}
