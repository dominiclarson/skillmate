

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { toMySqlDateTime } from '@/lib/schedule-utils';

export const runtime = 'nodejs';

/**
 * Creates a new availability slot for the current user
 * @param req - Request object containing startUtc, endUtc, and tz
 * @returns JSON response indicating success or error
 */
export async function POST(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const start = new Date(body.startUtc);
    const end   = new Date(body.endUtc);
    const tz    = String(body.tz || 'UTC');

    if (!(start instanceof Date) || isNaN(start.getTime()) ||
        !(end instanceof Date) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: 'Invalid times' }, { status: 400 });
    }
    const startUtc = toMySqlDateTime(start);
    const endUtc   = toMySqlDateTime(end);

    await pool.execute(
      `INSERT INTO Availability (user_id, start_utc, end_utc, tz)
       VALUES (?, ?, ?, ?)`,
      [me.id, startUtc, endUtc, tz]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error('Create availability error', e);
    return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 });
  }
}

/**
 * Retrieves all availability slots for the current user
 * @returns JSON response with availability data
 */
export async function GET() {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Availability
       WHERE user_id = ?
       ORDER BY start_utc DESC
       LIMIT 200`,
      [me.id]
    );
    return NextResponse.json(rows);
  } catch (e) {
    console.error('List availability error', e);
    return NextResponse.json({ error: 'Failed to load availability' }, { status: 500 });
  }
}
