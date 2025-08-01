

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const userId = session.id;

    const [rows] = await pool.execute(
      `
      SELECT DISTINCT u.id, u.name, u.email
      FROM FriendRequests f
      JOIN Users u ON u.id = IF(f.sender_id = ?, f.receiver_id, f.sender_id)
      WHERE (f.sender_id = ? OR f.receiver_id = ?)
        AND f.status = 'accepted'
      `,
      [userId, userId, userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Error fetching chat connections:', err);
    return NextResponse.json({ error: 'Failed to load connections' }, { status: 500 });
  }
}
