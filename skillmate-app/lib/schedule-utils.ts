

import pool from '@/lib/db';
import { NotificationType, notificationTypes } from './notification-types';

export function toMySqlDateTime(d: Date) {
  
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 19).replace('T', ' ');
}

export async function hasTeacherOverlap(
  teacherId: number,
  startUtc: string, 
  endUtc: string
): Promise<boolean> {
  const [rows] = await pool.execute(
    `SELECT 1 FROM Sessions
     WHERE teacher_id = ?
       AND status = 'accepted'
       AND NOT (end_utc <= ? OR start_utc >= ?)
     LIMIT 1`,
    [teacherId, startUtc, endUtc]
  );
  // @ts-ignore
  return rows.length > 0;
}

export async function createSessionReminders(
  sessionId: number,
  teacherId: number,
  studentId: number,
  startUtc: string 
) {

  const start = new Date(startUtc.replace(' ', 'T') + 'Z');
  const run24 = new Date(start.getTime() - 24 * 3600 * 1000);
  const run1  = new Date(start.getTime() - 1 * 3600 * 1000);

  const r24 = toMySqlDateTime(run24);
  const r1  = toMySqlDateTime(run1);

  const users = [teacherId, studentId];
  for (const uid of users) {
    await pool.execute(
      `INSERT IGNORE INTO Reminders (session_id, user_id, run_at_utc, kind)
       VALUES (?, ?, ?, '24h'), (?, ?, ?, '1h')`,
      [sessionId, uid, r24, sessionId, uid, r1]
    );
  }
}

export async function deletePendingReminders(sessionId: number) {
  await pool.execute(
    `DELETE FROM Reminders
     WHERE session_id = ? AND sent_at IS NULL`,
    [sessionId]
  );
}

export async function notify(
  userId: number,
  type: NotificationType,
  payload: any,
  channel: 'in_app' | 'email' = 'in_app'
) {
  if (!notificationTypes.includes(type)) {
    throw new Error(`notify(): unknown type "${type}"`);
  }
  await pool.execute(
    `INSERT INTO Notifications (user_id, type, payload, channel, sent_at)
     VALUES (?, ?, ?, ?, UTC_TIMESTAMP())`,
    [userId, type, JSON.stringify(payload), channel]
  );
}