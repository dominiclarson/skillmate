

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { receiverId } = await req.json();

  try {
    await pool.execute(
      'INSERT IGNORE INTO FriendRequests (sender_id, receiver_id) VALUES (?, ?)',
      [session.id, receiverId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Friend request error:', err);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
