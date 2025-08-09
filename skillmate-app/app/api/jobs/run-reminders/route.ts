

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Session reminder processing job endpoint
 * 
 * Background job that processes pending session reminders (24h and 1h before sessions)
 * and converts them into user notifications. Intended to be called by scheduled tasks.
 * 
 * @route GET /api/jobs/run-reminders
 * @returns JSON response with number of reminders processed
 * @throws {500} When reminder processing fails due to database error
 * 
 */
export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.user_id, r.session_id, r.kind, s.start_utc, s.teacher_id, s.student_id
       FROM Reminders r
       JOIN Sessions s ON s.id = r.session_id
       WHERE r.sent_at IS NULL
         AND r.run_at_utc <= UTC_TIMESTAMP()
       ORDER BY r.run_at_utc
       LIMIT 200`
    );

    const reminders = rows as Array<{
      id: number; user_id: number; session_id: number; kind: '24h'|'1h';
      start_utc: string; teacher_id: number; student_id: number;
    }>;

    for (const r of reminders) {
      const notifType = r.kind === '24h' ? 'reminder_24h' : 'reminder_1h';

      await pool.execute(
        `INSERT INTO Notifications (user_id, type, payload, channel, sent_at)
         VALUES (?, ?, ?, 'in_app', UTC_TIMESTAMP())`,
        [r.user_id, notifType, JSON.stringify({
          sessionId: r.session_id,
          startUtc: r.start_utc,
          counterpartId: (r.user_id === r.teacher_id ? r.student_id : r.teacher_id),
        })]
      );

      await pool.execute(`UPDATE Reminders SET sent_at = UTC_TIMESTAMP() WHERE id = ?`, [r.id]);
    }

    return NextResponse.json({ processed: reminders.length });
  } catch (e) {
    console.error('run-reminders error', e);
    return NextResponse.json({ error: 'Job failed' }, { status: 500 });
  }
}
