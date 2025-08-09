

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';
import { notify } from '@/lib/schedule-utils';

/**
 * Send friend request endpoint
 * 
 * Sends a friend request from the authenticated user to another user.
 * 
 * @route POST /api/friends/request
 * @param req - Request object containing friend request data
 * @param req.receiverId - User ID of the person to send friend request to
 * @returns JSON response with success status and request details
 * @throws {401} When user is not authenticated
 * @throws {400} When receiverId is invalid or user tries to friend themselves
 * @throws {404} When target user is not found
 * 
 */
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
