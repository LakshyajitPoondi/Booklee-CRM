import { createClient } from '@/lib/supabase/client';
import type {
  SupportTicketInsert,
  SupportTicketUpdate,
  SupportTicketRow,
  TicketResponseRow,
  TicketResponseInsert,
} from '@/types/database';

const supabase = createClient();

export async function getTickets(): Promise<SupportTicketRow[]> {
  const { data, error } = await (supabase.from('support_tickets') as any)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getTicketById(
  id: string,
): Promise<SupportTicketRow | null> {
  const { data, error } = await (supabase.from('support_tickets') as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTicket(
  ticket: SupportTicketInsert,
): Promise<SupportTicketRow> {
  const { data, error } = await (supabase.from('support_tickets') as any)
    .insert(ticket)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTicket(
  id: string,
  updates: SupportTicketUpdate,
): Promise<SupportTicketRow> {
  const { data, error } = await (supabase.from('support_tickets') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTicketResponses(
  ticketId: string,
): Promise<TicketResponseRow[]> {
  const { data, error } = await (supabase.from('ticket_responses') as any)
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addTicketResponse(
  response: TicketResponseInsert,
): Promise<TicketResponseRow> {
  const { data, error } = await (supabase.from('ticket_responses') as any)
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  return data;
}
