import type { User, Session } from '@supabase/supabase-js';
import type { ProfileRow, UserRole } from './database';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  avatarInitial: string;
  role: UserRole;
  phone: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  profile: ProfileRow | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Convert a Supabase auth user + profile row into an AuthUser
 */
export function toAuthUser(
  supabaseUser: User,
  profile: ProfileRow | null
): AuthUser {
  const fullName =
    profile?.full_name ||
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.email?.split('@')[0] ||
    'User';

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    fullName,
    avatarUrl:
      profile?.avatar_url ||
      supabaseUser.user_metadata?.avatar_url ||
      null,
    avatarInitial: fullName.charAt(0).toUpperCase(),
    role: profile?.role ?? 'client',
    phone: profile?.phone ?? null,
  };
}
