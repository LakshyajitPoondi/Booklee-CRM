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
  const { data, error } = await (supabase.from('support_tickets'))
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getTicketById(
  id: string,
): Promise<SupportTicketRow | null> {
  const { data, error } = await (supabase.from('support_tickets'))
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTicket(
  ticket: SupportTicketInsert,
): Promise<SupportTicketRow> {
  const { data, error } = await (supabase.from('support_tickets'))
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
  const { data, error } = await (supabase.from('support_tickets'))
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
  const { data, error } = await (supabase.from('ticket_responses'))
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addTicketResponse(
  response: TicketResponseInsert,
): Promise<TicketResponseRow> {
  const { data, error } = await (supabase.from('ticket_responses'))
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  return data;
}
