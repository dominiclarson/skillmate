

import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { toUserId, content } = await req.json();
  if (!toUserId || !content) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await pool.execute(
    `INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
    [session.id, toUserId, content]
  );

  return NextResponse.json({ success: true });
}
