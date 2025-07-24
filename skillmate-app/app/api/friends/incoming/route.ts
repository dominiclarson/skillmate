


import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
    `SELECT f.id, f.sender_id, u.name, u.email
     FROM FriendRequests f
     JOIN Users u ON f.sender_id = u.id
     WHERE f.receiver_id = ? AND f.status IS NULL`,
    [session.id]
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { requestId, accepted } = await req.json();
  const status = accepted ? 'accepted' : 'rejected';

  await pool.execute('UPDATE FriendRequests SET status = ? WHERE id = ?', [status, requestId]);
  return NextResponse.json({ success: true });
}
