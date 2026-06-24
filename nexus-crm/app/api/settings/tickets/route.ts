import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { SupportTicket } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.settings.supportTickets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const now = new Date().toISOString();
  const newTicket: SupportTicket = {
    id: generateId(),
    subject: body.subject,
    description: body.description,
    status: 'open',
    priority: body.priority || 'medium',
    createdAt: now,
    updatedAt: now,
    responses: [],
  };
  data.settings.supportTickets.push(newTicket);
  writeStore(data);
  return NextResponse.json(newTicket, { status: 201 });
}
