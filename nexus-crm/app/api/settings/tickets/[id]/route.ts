import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data = readStore();
  const index = data.settings.supportTickets.findIndex((t) => t.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // If body contains a new response, add it
  if (body.newResponse) {
    data.settings.supportTickets[index].responses.push({
      id: generateId(),
      message: body.newResponse,
      author: 'You',
      createdAt: new Date().toISOString(),
    });
    delete body.newResponse;
  }

  // Update other fields (status, priority, etc.)
  data.settings.supportTickets[index] = {
    ...data.settings.supportTickets[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  writeStore(data);
  return NextResponse.json(data.settings.supportTickets[index]);
}
