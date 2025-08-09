

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Teachers by skill endpoint
 * 
 * Retrieves all users who have a specific skill and can teach it.
 * 
 * @route GET /api/skills/teachers
 * @param req - Request object with query parameters
 * @param req.skillId - ID of the skill to find teachers for (query parameter)
 * @returns JSON array of teacher objects with id, name, email, and bio fields
 * @throws {400} When skillId parameter is missing
 * @throws {500} When teacher retrieval fails due to database error
 * 
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skillId = Number(searchParams.get('skillId') || '');
  if (!skillId) return NextResponse.json({ error: 'Missing skillId' }, { status: 400 });

  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.bio
       FROM user_has_skill hs
       JOIN Users u ON u.id = hs.user_id
       WHERE hs.skill_id = ?
       ORDER BY u.name IS NULL, u.name ASC, u.email ASC
       LIMIT 200`,
      [skillId]
    );
    return NextResponse.json(rows);
  } catch (e) {
    console.error('teachers by skill error', e);
    return NextResponse.json({ error: 'Failed to load teachers' }, { status: 500 });
  }
}
