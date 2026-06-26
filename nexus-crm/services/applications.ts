import { createClient } from '@/lib/supabase/client';
import type {
  ApplicationInsert,
  ApplicationUpdate,
  ApplicationRow,
} from '@/types/database';

const supabase = createClient();

export async function getApplications(): Promise<ApplicationRow[]> {
  const { data, error } = await supabase.from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getApplicationById(
  id: string
): Promise<ApplicationRow | null> {
  const { data, error } = await supabase.from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createApplication(
  app: ApplicationInsert
): Promise<ApplicationRow> {
  const { data, error } = await supabase.from('applications')
    .insert(app)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateApplication(
  id: string,
  updates: ApplicationUpdate
): Promise<ApplicationRow> {
  const { data, error } = await supabase.from('applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('applications')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
