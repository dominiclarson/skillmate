import pool from '@/lib/db';


export interface Skill {
    id: string;           // unique identifier, e.g. kebab‑case of name
    name: string;
    description: string;
    emoji: string;
}

/**
 * Retrieves all skills from the database
 * @returns JSON response with skills data
 */
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM skill');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('MySQL error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch skills' }),
      { status: 500 }
    );
  }
}


