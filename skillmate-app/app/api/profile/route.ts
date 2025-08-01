

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute('SELECT id, email, name, bio FROM Users WHERE id = ?', [session.id],);
  const [skills] = await pool.execute('SELECT skill_id FROM user_wants_skill WHERE user_id = ?',[session.id])
 return NextResponse.json({
  row: rows[0],
  skills
})

}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, bio, selectedSkills } = await req.json();
  await pool.execute('UPDATE Users SET name = ?, bio = ? WHERE id = ?', [name, bio, session.id]);


  return NextResponse.json({ success: true });
}
