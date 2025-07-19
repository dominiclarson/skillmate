
import { NextResponse } from 'next/server';
import { readUsers } from '@/lib/file-store';

export async function GET() {
  const users = await readUsers();
  return NextResponse.json(users);
}
