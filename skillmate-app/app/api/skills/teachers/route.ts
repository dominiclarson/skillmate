

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';


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
