

import { getSession } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

/**
 * Session validation endpoint
 * 
 * Retrieves the current user's session information from their authentication cookie.
 * 
 * @route GET /api/auth/session
 * @returns JSON response with session data or null if not authenticated
 * @throws {401} When user is not authenticated or session is invalid
 * 
 */
export async function GET() {
  console.log('Session API called');
  const session = await getSession();
  console.log('Session result:', session ? 'found' : 'null');
  
  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 });
  }
  return NextResponse.json({ session });
}
