'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      await signIn();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-pulse text-sm text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[450px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2563eb] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#111827]">UniJourney</h1>
          <p className="text-sm text-[#6B7280] mt-1">Student CRM Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
          <h2 className="text-lg font-semibold text-[#111827] text-center mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-[#6B7280] text-center mb-6">
            Sign in to access your dashboard
          </p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626]">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors text-sm font-medium text-[#374151] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {signingIn ? (
              <div className="w-5 h-5 border-2 border-[#E5E7EB] border-t-[#2563eb] rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <p className="text-xs text-[#9CA3AF] text-center mt-6">
          © {new Date().getFullYear()} UniJourney. All rights reserved.
        </p>
      </div>
    </div>
  );
}
