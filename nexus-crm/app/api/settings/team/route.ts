import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { TeamMember } from '@/types';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data.settings.teamMembers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = readStore();
  const newMember: TeamMember = {
    id: generateId(),
    name: body.name,
    email: body.email,
    role: body.role || 'Viewer',
    status: 'pending',
    joinedAt: new Date().toISOString(),
    avatarInitial: body.name.charAt(0).toUpperCase(),
  };
  data.settings.teamMembers.push(newMember);
  writeStore(data);
  return NextResponse.json(newMember, { status: 201 });
}
