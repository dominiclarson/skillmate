



import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

/**
 * Chat messages retrieval endpoint
 * 
 * Retrieves message history between the authenticated user and a specified user.
 * 
 * @route GET /api/chat/messages
 * @param req - Request object with query parameters
 * @param req.userId - Target user ID to retrieve chat messages with (query parameter)
 * @returns JSON array of message objects ordered by creation date
 * @throws {401} When user is not authenticated
 * @throws {400} When userId parameter is missing
 * @throws {500} When message retrieval fails due to database error
 * 
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
