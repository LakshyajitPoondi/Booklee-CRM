import { createClient } from '@/lib/supabase/client';
import type {
  ProfileRow,
  ProfileUpdate,
  CompanySettingsRow,
  CompanySettingsUpdate,
  NotificationPreferencesRow,
  NotificationPreferencesUpdate,
} from '@/types/database';

const supabase = createClient();

/* ============================================================
 * Profile
 * ============================================================ */
export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await (supabase.from('profiles') as any)
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<ProfileRow> {
  const { data, error } = await (supabase.from('profiles') as any)
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await (supabase.from('profiles') as any)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/* ============================================================
 * Company Settings
 * ============================================================ */
export async function getCompanySettings(): Promise<CompanySettingsRow | null> {
  const { data, error } = await (supabase.from('company_settings') as any)
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateCompanySettings(
  updates: CompanySettingsUpdate,
): Promise<CompanySettingsRow> {
  // Get existing settings row
  const existing = await getCompanySettings();
  if (!existing) throw new Error('Company settings not found');

  const { data, error } = await (supabase.from('company_settings') as any)
    .update(updates)
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ============================================================
 * Notification Preferences
 * ============================================================ */
export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferencesRow | null> {
  const { data, error } = await (supabase.from('notification_preferences') as any)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateNotificationPreferences(
  userId: string,
  updates: NotificationPreferencesUpdate,
): Promise<NotificationPreferencesRow> {
  // Try update first
  const { data: existing } = await (supabase.from('notification_preferences') as any)
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    const { data, error } = await (supabase.from('notification_preferences') as any)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Insert if not exists
  const { data, error } = await (supabase.from('notification_preferences') as any)
    .insert({ user_id: userId, ...updates })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ============================================================
 * Team Members (profiles with roles)
 * ============================================================ */
export async function getTeamMembers(): Promise<ProfileRow[]> {
  const { data, error } = await (supabase.from('profiles') as any)
    .select('*')
    .in('role', ['super_admin', 'admin', 'staff'])
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function updateMemberRole(
  userId: string,
  role: ProfileRow['role'],
): Promise<ProfileRow> {
  const { data, error } = await (supabase.from('profiles') as any)
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeMember(userId: string): Promise<void> {
  // Downgrade to client role instead of deleting
  const { error } = await (supabase.from('profiles') as any)
    .update({ role: 'client' })
    .eq('id', userId);

  if (error) throw error;
}
