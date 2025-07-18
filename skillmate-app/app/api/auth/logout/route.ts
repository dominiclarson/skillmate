import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-file';

export async function POST() {
  clearAuthCookie();
  return NextResponse.json({ message: 'Logged out' });
}
