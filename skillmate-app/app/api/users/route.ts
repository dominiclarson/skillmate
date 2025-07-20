
//import { NextResponse } from 'next/server';
//import { readUsers } from '@/lib/file-store';
import pool from '@/lib/db'; // assumes lib/db.js exists

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM user');

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('MySQL error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users' }),
      { status: 500 }
    );
  }
}


