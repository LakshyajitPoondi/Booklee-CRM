import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Document } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.documents);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const newDoc: Document = {
    ...body,
    id: generateId(),
    uploadedAt: new Date().toISOString(),
  };
  data.documents.push(newDoc);
  writeStore(data);
  return NextResponse.json(newDoc, { status: 201 });
}
