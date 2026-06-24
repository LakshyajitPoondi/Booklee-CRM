'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { signInWithGoogle, signOut as supabaseSignOut } from '@/lib/supabase/auth';
import type { AuthUser, AuthState } from '@/types/auth';
import { toAuthUser } from '@/types/auth';
import type { ProfileRow } from '@/types/database';
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return data;
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const p = await fetchProfile(session.user.id);
    if (p) {
      setProfile(p);
      setUser(toAuthUser(session.user, p));
    }
  }, [session, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          const p = await fetchProfile(currentSession.user.id);
          if (mounted) {
            setProfile(p);
            setUser(toAuthUser(currentSession.user, p));
          }
        }
      } catch {
        // Auth not available yet
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id);
        if (mounted) {
          setProfile(p);
          setUser(toAuthUser(newSession.user, p));
        }
      } else {
        setProfile(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await supabaseSignOut();
    setSession(null);
    setProfile(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, isLoading, signIn, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
