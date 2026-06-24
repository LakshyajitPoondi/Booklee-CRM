import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data = readStore();
  const index = data.leads.findIndex((l) => l.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.leads[index] = { ...data.leads[index], ...body, updatedAt: new Date().toISOString() };
  writeStore(data);
  return NextResponse.json(data.leads[index]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readStore();
  data.leads = data.leads.filter((l) => l.id !== id);
  writeStore(data);
  return NextResponse.json({ success: true });
}
