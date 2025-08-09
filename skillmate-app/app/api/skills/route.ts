import pool from '@/lib/db';

export interface Skill {
    id: string;           // unique identifier, e.g. kebab‑case of name
    name: string;
    description: string;
    emoji: string;

}

/**
 * Skills retrieval endpoint
 * 
 * Retrieves all available skills from the database.
 * 
 * @route GET /api/skills
 * @returns JSON array of skill objects with id, name, description, and emoji fields
 * @throws {500} When skills retrieval fails due to database error
 * 
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


