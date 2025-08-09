

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { notify, toMySqlDateTime } from '@/lib/schedule-utils';

export const runtime = 'nodejs'; 

/**
 * User sessions retrieval endpoint
 * 
 * Retrieves sessions for the authenticated user filtered by their role (teacher, student, or all).
 * 
 * @route GET /api/sessions
 * @param req - Request object with optional query parameters
 * @param req.role - Filter by user role: 'teacher', 'student', 'all', or null for all (query parameter)
 * @returns JSON array of session objects with teacher/student names and skill information
 * @throws {401} When user is not authenticated
 */
export async function GET(req: Request) {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url  = new URL(req.url);
  const role = url.searchParams.get('role'); 

  const [rows] = await pool.execute(
    `SELECT s.*,
            CONCAT_WS(' ', t.first_name, t.last_name) AS teacherName,
            CONCAT_WS(' ', st.first_name, st.last_name) AS studentName,
            sk.name AS skillName
       FROM Sessions s
       JOIN Users t  ON t.id  = s.teacher_id
       JOIN Users st ON st.id = s.student_id
       LEFT JOIN Skill sk ON sk.id = s.skill_id
      WHERE ( (s.teacher_id = ? AND ? IN ('teacher', 'all', NULL)) OR
              (s.student_id = ? AND ? IN ('student', 'all', NULL)) )
      ORDER BY s.start_utc DESC
      LIMIT 50`,
    [me.id, role, me.id, role]
  );

  return NextResponse.json(rows);
}

/**
 * Session request creation endpoint
 * 
 * Creates a new session request from a student to a teacher.
 * 
 * @route POST /api/sessions
 * @param req - Request object containing session request data
 * @param req.teacherId - ID of the teacher to request session with
 * @param req.skillId - ID of the skill for the session (optional)
 * @param req.startUtc - Session start time in UTC format
 * @param req.durationMins - Session duration in minutes (default: 60)
 * @param req.notes - Additional notes for the session (default: empty)
 * @returns JSON response with created session ID
 * @throws {401} When user is not authenticated
 * @throws {400} When required parameters are missing or invalid
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
