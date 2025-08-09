



import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

/**
 * Retrieves pending friend requests sent by the current user
 * @returns JSON response with pending friend requests
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
    'SELECT receiver_id FROM FriendRequests WHERE sender_id = ? AND status IS NULL',
    [session.id]
  );

  return NextResponse.json(rows);
}
