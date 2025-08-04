

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';
import { notify } from '@/lib/schedule-utils';

export async function POST(req: Request) {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { receiverId } = await req.json();
  const to = Number(receiverId);

  if (!to || to === me.id)
    return NextResponse.json({ error: 'Invalid receiverId' }, { status: 400 });


  const [u]: any = await pool.execute('SELECT id FROM Users WHERE id = ? LIMIT 1', [to]);
  if (!u.length)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });


  const [existing]: any = await pool.execute(
    `SELECT id, status
     FROM FriendRequests
     WHERE sender_id = ? AND receiver_id = ?
     ORDER BY id DESC LIMIT 1`,
    [me.id, to]
  );

  if (existing.length) {
    const row = existing[0];
    if (row.status === null)
      return NextResponse.json({ ok: true, requestId: row.id, pending: true });
  
  }


  const [res]: any = await pool.execute(
    `INSERT INTO FriendRequests (sender_id, receiver_id)
     VALUES (?, ?)`,
    [me.id, to]
  );
  const requestId = res.insertId;

  await notify(to, 'friend_request_received', { requestId, fromUserId: me.id });

  return NextResponse.json({ ok: true, requestId });
}
