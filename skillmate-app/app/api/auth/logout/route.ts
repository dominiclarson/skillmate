

import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-utils';

/**
 * Handles user logout by clearing authentication cookie
 * @returns JSON response indicating successful logout
 */
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
