import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM skill');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json',    
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store', },
    });
  } catch (err) {
    console.error('MySQL error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch skills' }),
      { status: 500 }
    );
  }
}
