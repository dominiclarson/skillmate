

import { getSession } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

/**
 * Retrieves the current user session
 * @returns JSON response with session data or null
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
