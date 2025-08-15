

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
export async function GET(req: Request) {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url  = new URL(req.url);
  const role = url.searchParams.get('role'); 

  let whereClause = '';
  let params: any[] = [];
  
  if (role === 'teacher') {
    whereClause = 'WHERE s.teacher_id = ?';
    params = [me.id];
  } else if (role === 'student') {
    whereClause = 'WHERE s.student_id = ?';
    params = [me.id];
  } else {
    // role === 'all' or null - show all sessions where user is either teacher or student
    whereClause = 'WHERE (s.teacher_id = ? OR s.student_id = ?)';
    params = [me.id, me.id];
  }

  const [rows] = await pool.execute(
    `SELECT s.*,
            CONCAT_WS(' ', t.first_name, t.last_name) AS teacherName,
            CONCAT_WS(' ', st.first_name, st.last_name) AS studentName,
            sk.name AS skillName
       FROM Sessions s
       JOIN Users t  ON t.id  = s.teacher_id
       JOIN Users st ON st.id = s.student_id
       LEFT JOIN Skill sk ON sk.id = s.skill_id
      ${whereClause}
      ORDER BY s.start_utc DESC
      LIMIT 50`,
    params
  );

  return NextResponse.json(rows);
}

/**
 * Creates a new session request
 * @param req - Request object containing teacherId, skillId, startUtc, durationMins, notes
 * @returns JSON response with session id or error
 */
export async function POST(req: Request) {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    teacherId,
    skillId,
    startUtc,
    durationMins = 60,
    notes = '',
  } = await req.json();

  if (!teacherId || !startUtc)
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const start = new Date(
    typeof startUtc === 'string'
      ? startUtc.includes('T')
        ? startUtc
        : startUtc.replace(' ', 'T') + 'Z'
      : startUtc
  );
  if (isNaN(start.valueOf()))
    return NextResponse.json({ error: 'Bad startUtc' }, { status: 400 });

  const end = new Date(start.getTime() + durationMins * 60_000);

  const [result]: any = await pool.execute(
    `INSERT INTO Sessions
       (teacher_id, student_id, skill_id,
        start_utc, end_utc, status, notes)
     VALUES (?, ?, ?, ?, ?, 'requested', ?)`,
    [
      teacherId,
      me.id,
      skillId ?? null,
      toMySqlDateTime(start),
      toMySqlDateTime(end),
      notes,
    ]
  );

  const sessionId = result.insertId;


  await notify(teacherId, 'session_requested', { sessionId });

  return NextResponse.json({ id: sessionId }, { status: 201 });
}
