import { createClient } from '@/lib/supabase/client';
import type { LeadInsert, LeadUpdate, LeadRow } from '@/types/database';

const supabase = createClient();

export async function getLeads(): Promise<LeadRow[]> {
  const { data, error } = await supabase.from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getLeadById(id: string): Promise<LeadRow | null> {
  const { data, error } = await supabase.from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLead(lead: LeadInsert): Promise<LeadRow> {
  const { data, error } = await supabase.from('leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLead(
  id: string,
  updates: LeadUpdate
): Promise<LeadRow> {
  const { data, error } = await supabase.from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}
