import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Application } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.applications);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const now = new Date().toISOString();
  const newApp: Application = {
    ...body,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  data.applications.push(newApp);
  writeStore(data);
  return NextResponse.json(newApp, { status: 201 });
}
