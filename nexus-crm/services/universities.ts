import { createClient } from '@/lib/supabase/client';
import type {
  UniversityInsert,
  UniversityUpdate,
  UniversityRow,
} from '@/types/database';

const supabase = createClient();

export async function getUniversities(): Promise<UniversityRow[]> {
  const { data, error } = await (supabase.from('universities'))
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getUniversityById(
  id: string
): Promise<UniversityRow | null> {
  const { data, error } = await (supabase.from('universities'))
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createUniversity(
  uni: UniversityInsert
): Promise<UniversityRow> {
  const { data, error } = await (supabase.from('universities'))
    .insert(uni)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUniversity(
  id: string,
  updates: UniversityUpdate
): Promise<UniversityRow> {
  const { data, error } = await (supabase.from('universities'))
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUniversity(id: string): Promise<void> {
  const { error } = await (supabase.from('universities'))
    .delete()
    .eq('id', id);

  if (error) throw error;
}
