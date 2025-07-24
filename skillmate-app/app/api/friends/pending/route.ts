



import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
    'SELECT receiver_id FROM FriendRequests WHERE sender_id = ? AND status IS NULL',
    [session.id]
  );

  return NextResponse.json(rows);
}
