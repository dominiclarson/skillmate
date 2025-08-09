

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export const runtime = 'nodejs';

/**
 * User notifications endpoint
 * 
 * Retrieves all unread/undismissed notifications for the authenticated user.
 * 
 * @route GET /api/notifications
 * @returns JSON array of notification objects ordered by creation date
 * @throws {401} When user is not authenticated
 * 
 */
export async function GET() {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
    `SELECT *
       FROM Notifications
      WHERE user_id = ?
        AND dismissed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 100`,
    [me.id]
  );

  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

/**
 * Mark all notifications as read endpoint
 * 
 * Marks all unread notifications for the authenticated user as read.
 * 
 * @route PATCH /api/notifications
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * 
 */
export async function PATCH() {
  const me = await getSession();
   if (!me)
   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await pool.execute(
         `UPDATE Notifications
        SET read_at = UTC_TIMESTAMP()
     WHERE user_id = ?
        AND read_at IS NULL`,
            [me.id]
   );

   return NextResponse.json({ ok: true });
 }
