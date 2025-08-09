

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

/**
 * User profile retrieval endpoint
 * 
 * Retrieves the authenticated user's profile information including skills they have and want.
 * 
 * @route GET /api/profile
 * @returns JSON object with user profile data, skills they have, and skills they want
 * @throws {401} When user is not authenticated
 * 
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
      `SELECT id,
              email,
              first_name   AS firstName,
              last_name    AS lastName,
              CONCAT_WS(' ', first_name, last_name) AS name,
              bio
         FROM Users
        WHERE id = ?`,
      [session.id]
    );
    
  const [skillsW] = await pool.execute('SELECT skill_id FROM user_wants_skill WHERE user_id = ?',[session.id]);
  const [skillsH] = await pool.execute('SELECT skill_id FROM user_has_skill WHERE user_id = ?',[session.id])
 return NextResponse.json({
  row: rows[0],
  skillsW,
  skillsH
})

}

/**
 * User profile update endpoint
 * 
 * Updates the authenticated user's profile information including name, bio, and skill associations.
 * 
 * @route POST /api/profile
 * @param req - Request object containing profile update data
 * @param req.name - User's display name
 * @param req.bio - User's biography/description
 * @param req.skillsW - Array of skill IDs that the user wants to learn
 * @param req.skillsH - Array of skill IDs that the user has/can teach
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * 
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, bio, skillsW, skillsH} = await req.json();
  await pool.execute('UPDATE Users SET name = ?, bio = ? WHERE id = ?', [name, bio, session.id]);

  // Update skills I Want
  await pool.execute('DELETE FROM user_wants_skill WHERE user_id = ?', [session.id]);
  for (const sW of skillsW) {
    await pool.execute('INSERT user_wants_skill SET user_id = ?, skill_id = ?', [session.id, sW]);
  }

  // Update skills I Have
  await pool.execute('DELETE FROM user_has_skill WHERE user_id = ?', [session.id]);
  for (const sH of skillsH) {
    await pool.execute('INSERT user_has_skill SET user_id = ?, skill_id = ?', [session.id, sH]);
  }

  return NextResponse.json({ success: true });
}
