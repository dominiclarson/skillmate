


import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';
import { notify } from '@/lib/schedule-utils';

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
  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });

  const status = accepted ? 'accepted' : 'rejected';


  const [rows]: any = await pool.execute(
    `SELECT sender_id, receiver_id FROM FriendRequests WHERE id = ? LIMIT 1`,
    [requestId]
  );
  const reqRow = rows?.[0];
  if (!reqRow) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (reqRow.receiver_id !== session.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await pool.execute('UPDATE FriendRequests SET status = ? WHERE id = ?', [status, requestId]);

  
  const type = accepted
    ? 'friend_request_accepted'
    : 'friend_request_rejected';
  
  await notify(reqRow.sender_id, type, {
    requestId,
    byUserId: session.id,
  }); 

  return NextResponse.json({ success: true });
}
