

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute('SELECT id, email, name, bio FROM Users WHERE id = ?', [session.id]);
  return NextResponse.json(rows[0]);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, bio } = await req.json();
  await pool.execute('UPDATE Users SET name = ?, bio = ? WHERE id = ?', [name, bio, session.id]);
  return NextResponse.json({ success: true });
}