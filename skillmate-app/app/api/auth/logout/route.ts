export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-file';

export async function POST(req: Request) {
  await clearAuthCookie();
  return NextResponse.json({ message: 'Logged out' });
}