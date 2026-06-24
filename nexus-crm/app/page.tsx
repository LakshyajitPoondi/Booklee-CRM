'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
    } else if (user.role === 'client') {
      router.replace('/client/dashboard');
    } else {
      router.replace('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="animate-pulse text-sm text-[#6B7280]">Redirecting...</div>
    </div>
  );
}
