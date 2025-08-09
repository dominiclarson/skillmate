

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { toMySqlDateTime } from '@/lib/schedule-utils';

export const runtime = 'nodejs';

/**
 * User availability management endpoint
 * 
 * Manages the authenticated user's availability time slots for scheduling sessions.
 * 
 * @route POST /api/availability
 * @param req - Request object containing availability data
 * @param req.startUtc - Start time in UTC ISO format
 * @param req.endUtc - End time in UTC ISO format  
 * @param req.tz - Timezone identifier (optional, defaults to 'UTC')
 * @returns JSON response with success status or error message
 * @throws {401} When user is not authenticated
 * @throws {400} When provided times are invalid or end time is before start time
 * @throws {500} When availability creation fails due to database error
 * 
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
 * Get user availability endpoint
 * 
 * Retrieves the authenticated user's availability time slots ordered by start time.
 * 
 * @route GET /api/availability
 * @returns JSON array of availability objects with start_utc, end_utc, and tz fields
 * @throws {401} When user is not authenticated
 * @throws {500} When availability retrieval fails due to database error
 * 
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
