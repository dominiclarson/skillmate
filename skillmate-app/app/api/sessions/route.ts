

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { toMySqlDateTime, notify } from '@/lib/schedule-utils';

export async function POST(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { teacherId, startUtc, notes } = await req.json();

    const start = new Date(startUtc);
    if (!teacherId || isNaN(start.getTime()))
      return NextResponse.json({ error: 'Bad data' }, { status: 400 });
    if (teacherId === me.id)
      return NextResponse.json({ error: 'Cannot teach yourself' }, { status: 400 });

    //  1 hour lesson
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // ensure teacher exists
    const [t]: any = await pool.execute(
      'SELECT id FROM Users WHERE id = ? LIMIT 1',
      [teacherId]
    );
    if (!t.length)
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });

    const startSql = toMySqlDateTime(start);
    const endSql   = toMySqlDateTime(end);

    const [res]: any = await pool.execute(
      `INSERT INTO Sessions
       (teacher_id, student_id, start_utc, end_utc, notes, status)
       VALUES (?, ?, ?, ?, ?, 'requested')`,
      [teacherId, me.id, startSql, endSql, notes ?? null]
    );

    await notify(teacherId, 'session_requested', {
      sessionId: res.insertId,
      studentId: me.id,
      startUtc: startSql,
    });

    return NextResponse.json({ ok: true, id: res.insertId }, { status: 201 });
  } catch (e) {
    console.error('Create session error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  const filter =
    role === 'teacher'
      ? 'teacher_id = ?'
      : role === 'student'
      ? 'student_id = ?'
      : '(teacher_id = ? OR student_id = ?)';
  const args = role ? [me.id] : [me.id, me.id];

  const [rows] = await pool.execute(
    `SELECT * FROM Sessions WHERE ${filter} ORDER BY start_utc DESC LIMIT 200`,
    args
  );
  return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } });
}
