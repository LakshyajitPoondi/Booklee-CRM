import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Lead } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...body,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  data.leads.push(newLead);
  writeStore(data);
  return NextResponse.json(newLead, { status: 201 });
}
