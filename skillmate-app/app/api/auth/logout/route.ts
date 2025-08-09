

import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-utils';

/**
 * Authentication logout endpoint
 * 
 * Logs out the current user by clearing their authentication cookie.
 * 
 * @route POST /api/auth/logout
 * @returns JSON response with success status
 * 
 */
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
