import { NextResponse } from 'next/server';
import pool from '@/lib/db'; 
import { getSession } from '@/lib/auth-utils'; 

export async function POST(req: Request) {
  try {
    const me = await getSession?.().catch(() => null);
    const { name, description } = await req.json();

    const trimmed = (name ?? '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (trimmed.length > 100) {
      return NextResponse.json({ error: 'Name too long (max 100)' }, { status: 400 });
    }

    await pool.execute(
      `INSERT INTO suggestions (skillname, description, user_id)
       VALUES (?, ?, ?)`,
      [trimmed, description?.toString()?.trim() || null, me?.id ?? null]
    );

    return NextResponse.json(
      { ok: true, message: 'Suggestion submitted' },
      { status: 201 }
    );
  } catch (err) {
    console.error('suggest POST failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}