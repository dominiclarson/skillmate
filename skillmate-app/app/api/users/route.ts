


import { getSession } from '@/lib/auth-utils';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email FROM Users WHERE id != ?',
      [session.id]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Failed to load users:', err);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}
