import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = readStore();
  data.settings = { ...data.settings, ...body };
  writeStore(data);
  return NextResponse.json(data.settings);
}
