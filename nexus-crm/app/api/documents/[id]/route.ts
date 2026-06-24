import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data = readStore();
  const index = data.documents.findIndex((d) => d.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.documents[index] = { ...data.documents[index], ...body };
  writeStore(data);
  return NextResponse.json(data.documents[index]);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readStore();
  data.documents = data.documents.filter((d) => d.id !== id);
  writeStore(data);
  return NextResponse.json({ success: true });
}
