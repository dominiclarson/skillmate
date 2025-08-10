



import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

/**
 * Retrieves messages between current user and specified user
 * @param req - Request object with userId query parameter
 * @returns JSON response with messages
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const toUserId = searchParams.get('userId');

  if (!toUserId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const [messages] = await pool.execute(
      `SELECT * FROM Messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [session.id, toUserId, toUserId, session.id]
    );

    return NextResponse.json(messages);
  } catch (err) {
    console.error('Message fetch error:', err);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}
