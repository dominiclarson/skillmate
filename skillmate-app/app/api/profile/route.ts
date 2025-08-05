

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute('SELECT id, email, name, bio FROM Users WHERE id = ?', [session.id],);
  const [skillsW] = await pool.execute('SELECT skill_id FROM user_wants_skill WHERE user_id = ?',[session.id]);
  const [skillsH] = await pool.execute('SELECT skill_id FROM user_has_skill WHERE user_id = ?',[session.id])
 return NextResponse.json({
  row: rows[0],
  skillsW,
  skillsH
})

}

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
