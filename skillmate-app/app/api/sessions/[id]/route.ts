

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { createSessionReminders } from '@/lib/schedule-utils';

export const runtime = 'nodejs'; 

/**
 * Session status update endpoint
 * 
 * Allows users to accept, decline, or cancel a session request.
 * 
 * @route PATCH /api/sessions/[id]
 * @param req - Request object containing action to perform
 * @param req.action - Action to perform: 'accept', 'decline', or 'cancel'
 * @param params - Route parameters containing session ID
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * @throws {400} When session ID is invalid
 * @throws {500} When session update fails
 * 
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getSession();
  if (!me) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  
  const { id } = await params;
  const sessionId = Number(id);
  if (!sessionId) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  const { action } = await req.json(); 
  const newStatus =
    action === 'accept'
      ? 'accepted'
      : action === 'decline'
      ? 'declined'
      : 'cancelled';

  try {
   
    await pool.execute(
      'UPDATE Sessions SET status = ? WHERE id = ?',
      [newStatus, sessionId]
    );

    
    const [rows]: any = await pool.execute(
      'SELECT start_utc FROM Sessions WHERE id = ? LIMIT 1',
      [sessionId]
    );

    if (rows.length) {
      const teacherId = 1; 
      const studentId = 2; 
      await createSessionReminders(sessionId, teacherId, studentId, rows[0].start_utc);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('PATCH /sessions/:id error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
