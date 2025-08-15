

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { createSessionReminders } from '@/lib/schedule-utils';

export const runtime = 'nodejs'; 

/**
 * Updates a session status (accept, decline, cancel)
 * @param req - Request object containing action
 * @param params - Route parameters containing session id
 * @returns JSON response indicating success or error
 */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const sid = Number(id);
  if (!sid) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || '');

    const [[session]]: any = await pool.execute(
      `SELECT id, teacher_id, student_id, status FROM Sessions WHERE id = ?`,
      [sid]
    );
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isTeacher = session.teacher_id === me.id;
    const isStudent = session.student_id === me.id;
    if (!isTeacher && !isStudent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let nextStatus: string | null = null;

    switch (action) {
      case 'accept':
        if (!isTeacher) return NextResponse.json({ error: 'Only teacher can accept' }, { status: 403 });
        if (session.status !== 'requested') return NextResponse.json({ error: 'Cannot accept now' }, { status: 400 });
        nextStatus = 'accepted';
        break;
      case 'decline':
        if (!isTeacher) return NextResponse.json({ error: 'Only teacher can decline' }, { status: 403 });
        if (session.status !== 'requested') return NextResponse.json({ error: 'Cannot decline now' }, { status: 400 });
        nextStatus = 'declined';
        break;
      case 'cancel':
        if (!['requested', 'accepted'].includes(session.status)) {
          return NextResponse.json({ error: 'Cannot cancel now' }, { status: 400 });
        }
        nextStatus = 'cancelled';
        break;
      case 'complete':
        if (!['accepted'].includes(session.status)) {
          return NextResponse.json({ error: 'Cannot complete now' }, { status: 400 });
        }
        nextStatus = 'completed';
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await pool.execute(
      `UPDATE Sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [nextStatus, sid]
    );

    return NextResponse.json({ ok: true, status: nextStatus });
  } catch (err) {
    console.error('Patch session error', err);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/sessions/:id
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const sid = Number(id);
  if (!sid) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  try {
    const [[session]]: any = await pool.execute(
      `SELECT id, teacher_id, student_id FROM Sessions WHERE id = ?`,
      [sid]
    );
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (session.teacher_id !== me.id && session.student_id !== me.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await pool.execute(`DELETE FROM Sessions WHERE id = ?`, [sid]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete session error', err);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}