

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export const runtime = 'nodejs';             

/**
 * Mark specific notification as read endpoint
 * 
 * Marks a specific notification as read for the authenticated user.
 * 
 * @route PATCH /api/notifications/[id]
 * @param req - Request object
 * @param params - Route parameters containing notification ID
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * @throws {500} When marking notification as read fails
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await getSession();
    if (!me)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

 
    const { id } = await params;

    await pool.execute(
      `UPDATE Notifications
          SET read_at = UTC_TIMESTAMP()
        WHERE id = ? AND user_id = ?`,
      [Number(id), me.id],
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('PATCH /notifications/:id', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * Dismiss specific notification endpoint
 * 
 * Dismisses (soft deletes) a specific notification for the authenticated user.
 * 
 * @route DELETE /api/notifications/[id]
 * @param req - Request object
 * @param params - Route parameters containing notification ID
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * @throws {500} When dismissing notification fails
 * 
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await getSession();
    if (!me) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await pool.execute(
      `UPDATE Notifications
          SET dismissed_at = UTC_TIMESTAMP()
        WHERE id = ? AND user_id = ?`,
      [Number(id), me.id],
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /notifications/:id', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
