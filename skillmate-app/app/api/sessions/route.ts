

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { notify, toMySqlDateTime } from '@/lib/schedule-utils';

export const runtime = 'nodejs'; 

/**
 * Retrieves sessions for the current user with optional role filtering
 * @param req - Request object with optional role query parameter
 * @returns JSON response with session data
 */
function toMysqlUtc(local: string | Date) {
  const d = typeof local === 'string' ? new Date(local) : local;
  
  if (isNaN(d.getTime())) return null;
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString(); // normalize
  return iso.slice(0, 19).replace('T', ' ');
}



export async function POST(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const teacherId = Number(body?.teacherId);
    const startLocal = String(body?.startLocal || '');
    const durationMins = Number(body?.durationMins || 60);
    const notes = (body?.notes || '').trim();

    if (!teacherId || !startLocal) {
      return NextResponse.json({ error: 'Missing teacherId or startLocal' }, { status: 400 });
    }
    if (teacherId === me.id) {
      return NextResponse.json({ error: 'Cannot book yourself' }, { status: 400 });
    }

    const startDate = new Date(startLocal);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({ error: 'Bad startLocal datetime' }, { status: 400 });
    }
    const endDate = new Date(startDate.getTime() + durationMins * 60_000);

    const startUtc = toMysqlUtc(startDate)!;
    const endUtc = toMysqlUtc(endDate)!;

  
    const [conflicts] = await pool.execute(
      `SELECT id FROM Sessions
        WHERE teacher_id = ? 
          AND status IN ('requested','accepted','completed')
          AND start_utc < ? AND end_utc > ?`,
      [teacherId, endUtc, startUtc]
    );
    if ((conflicts as any[]).length) {
      return NextResponse.json({ error: 'Teacher is unavailable at that time' }, { status: 409 });
    }

    const [result]: any = await pool.execute(
      `INSERT INTO Sessions (teacher_id, student_id, start_utc, end_utc, status, notes)
       VALUES (?, ?, ?, ?, 'requested', ?)`,
      [teacherId, me.id, startUtc, endUtc, notes || null]
    );

    return NextResponse.json({ id: result.insertId, ok: true });
  } catch (err) {
    console.error('Create session error:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

// GET /api/sessions
export async function GET(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = (searchParams.get('role') || 'all').toLowerCase();

  try {
    const where =
      role === 'teacher'
        ? 's.teacher_id = ?'
        : role === 'student'
        ? 's.student_id = ?'
        : '(s.teacher_id = ? OR s.student_id = ?)';

    const params =
      role === 'teacher' || role === 'student' ? [me.id] : [me.id, me.id];

    //show full names
    const [rows] = await pool.execute(
      `SELECT
         s.id, s.teacher_id, s.student_id, s.start_utc, s.end_utc, s.status, s.notes, s.created_at,
         COALESCE(CONCAT(t.first_name, ' ', t.last_name), t.name, t.email) AS teacher_name,
         COALESCE(CONCAT(st.first_name, ' ', st.last_name), st.name, st.email) AS student_name
       FROM Sessions s
       JOIN Users t  ON t.id  = s.teacher_id
       JOIN Users st ON st.id = s.student_id
       WHERE ${where}
       ORDER BY s.start_utc DESC`,
      params as any[]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Fetch sessions error:', err);
    return NextResponse.json({ error: 'Failed to load sessions' }, { status: 500 });
  }
}