import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { University } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.universities);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const newUni: University = {
    ...body,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.universities.push(newUni);
  writeStore(data);
  return NextResponse.json(newUni, { status: 201 });
}
