import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data = readStore();
  const index = data.settings.teamMembers.findIndex((m) => m.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.settings.teamMembers[index] = { ...data.settings.teamMembers[index], ...body };
  writeStore(data);
  return NextResponse.json(data.settings.teamMembers[index]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readStore();
  data.settings.teamMembers = data.settings.teamMembers.filter((m) => m.id !== id);
  writeStore(data);
  return NextResponse.json({ success: true });
}
