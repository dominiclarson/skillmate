



import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

/**
 * Pending friend requests endpoint
 * 
 * Retrieves friend requests sent by the authenticated user that are still pending (not yet accepted/rejected).
 * 
 * @route GET /api/friends/pending
 * @returns JSON array of pending request objects with receiver_id field
 * @throws {401} When user is not authenticated
 * 
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
