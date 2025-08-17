import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';

// Earth radius in miles
const EARTH_MI = 3959;

/**
 * - Always filters by skillId
 * - Optionally filters by distance and includes distance_mi
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const skillId = Number(searchParams.get('skillId') || '');
  const lat = searchParams.get('lat') ? Number(searchParams.get('lat')) : null;
  const lng = searchParams.get('lng') ? Number(searchParams.get('lng')) : null;
  const radiusMi = Number(searchParams.get('radiusMi') || '25');

  if (!skillId) {
    return NextResponse.json({ error: 'Missing skillId' }, { status: 400 });
  }

  const usingGeo = lat !== null && !Number.isNaN(lat) && lng !== null && !Number.isNaN(lng);

  try {
    if (usingGeo) {
      // Haversine (safe with clamp) — requires users to have lat/lng
      const distanceExpr = `
        ${EARTH_MI} * ACOS(
          LEAST(1, GREATEST(-1,
            COS(RADIANS(?)) * COS(RADIANS(u.latitude)) *
            COS(RADIANS(u.longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(u.latitude))
          ))
        )
      `;

      const sql = `
        SELECT
          u.id,
          u.name,
          u.email,
          u.bio,
          u.latitude,
          u.longitude,
          ${distanceExpr} AS distance_mi
        FROM user_has_skill hs
        JOIN Users u ON u.id = hs.user_id
        WHERE hs.skill_id = ?
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        HAVING distance_mi <= ?
        ORDER BY distance_mi ASC, (u.name IS NULL), u.name ASC, u.email ASC
        LIMIT 200
      `;

      // params order must match the placeholders in distanceExpr first, then skillId, then radius
      const params = [lat!, lng!, lat!, skillId, radiusMi];
      const [rows] = await pool.execute(sql, params as any[]);
      return NextResponse.json(rows);
    } else {
      // No geo filter — original behavior
      const sql = `
        SELECT u.id, u.name, u.email, u.bio
        FROM user_has_skill hs
        JOIN Users u ON u.id = hs.user_id
        WHERE hs.skill_id = ?
        ORDER BY u.name IS NULL, u.name ASC, u.email ASC
        LIMIT 200
      `;
      const [rows] = await pool.execute(sql, [skillId]);
      return NextResponse.json(rows);
    }
  } catch (e) {
    console.error('teachers by skill (with optional geo) error', e);
    return NextResponse.json({ error: 'Failed to load teachers' }, { status: 500 });
  }
}

