

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import {
  createSessionReminders,
  deletePendingReminders,
  notify,
  toMySqlDateTime,
  hasTeacherOverlap,
} from '@/lib/schedule-utils';

export const runtime = 'nodejs';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  try {
    const body = await req.json();
    const action = String(body.action);

    
    const [rows] = await pool.execute(
      `SELECT * FROM Sessions WHERE id = ? LIMIT 1`,
      [id]
    );
    
    const s = rows[0];
    if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });

   
    const isTeacher = s.teacher_id === me.id;
    const isStudent = s.student_id === me.id;

    if (action === 'accept') {
      if (!isTeacher) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (s.status !== 'requested') return NextResponse.json({ ok: true }); 

     
      const overlap = await hasTeacherOverlap(
        s.teacher_id,
        s.start_utc,
        s.end_utc
      );
      if (overlap) {
        return NextResponse.json({ error: 'Teacher not available' }, { status: 409 });
      }

      await pool.execute(
        `UPDATE Sessions SET status = 'accepted' WHERE id = ? AND status = 'requested'`,
        [id]
      );

      await createSessionReminders(id, s.teacher_id, s.student_id, s.start_utc);

      
      await notify(s.teacher_id, 'session_accepted', { sessionId: id, startUtc: s.start_utc, counterpartId: s.student_id });
      await notify(s.student_id, 'session_accepted', { sessionId: id, startUtc: s.start_utc, counterpartId: s.teacher_id });

      return NextResponse.json({ ok: true });
    }

    if (action === 'decline') {
      if (!isTeacher) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (s.status !== 'requested') return NextResponse.json({ ok: true }); 

      await pool.execute(
        `UPDATE Sessions SET status = 'declined' WHERE id = ? AND status = 'requested'`,
        [id]
      );

      await notify(s.student_id, 'session_declined', { sessionId: id, startUtc: s.start_utc, counterpartId: s.teacher_id });
      return NextResponse.json({ ok: true });
    }

    if (action === 'cancel') {
      if (!isTeacher && !isStudent) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (s.status === 'cancelled' || s.status === 'declined') return NextResponse.json({ ok: true }); 

      await pool.execute(`UPDATE Sessions SET status = 'cancelled' WHERE id = ?`, [id]);
      await deletePendingReminders(id);

      const counterpartId = isTeacher ? s.student_id : s.teacher_id;
      await notify(counterpartId, 'session_cancelled', { sessionId: id, startUtc: s.start_utc, by: me.id });
      return NextResponse.json({ ok: true });
    }

    if (action === 'reschedule') {
      // only teacher can reschedule 
      if (!isTeacher) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

      const start = new Date(body.startUtc);
      const end   = new Date(body.endUtc);
      if (!(start instanceof Date) || isNaN(start.getTime()) ||
          !(end instanceof Date) || isNaN(end.getTime()) || end <= start) {
        return NextResponse.json({ error: 'Invalid times' }, { status: 400 });
      }
      const startUtc = toMySqlDateTime(start);
      const endUtc   = toMySqlDateTime(end);

      
      const overlap = await hasTeacherOverlap(s.teacher_id, startUtc, endUtc);
      if (overlap) {
        return NextResponse.json({ error: 'Teacher not available' }, { status: 409 });
      }

      await pool.execute(
        `UPDATE Sessions
         SET start_utc = ?, end_utc = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [startUtc, endUtc, id]
      );

      await deletePendingReminders(id);
      await createSessionReminders(id, s.teacher_id, s.student_id, startUtc);

      // notify both
      await notify(s.teacher_id, 'session_accepted', { sessionId: id, startUtc, reschedule: true, counterpartId: s.student_id });
      await notify(s.student_id, 'session_accepted', { sessionId: id, startUtc, reschedule: true, counterpartId: s.teacher_id });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    console.error('Patch session error', e);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
