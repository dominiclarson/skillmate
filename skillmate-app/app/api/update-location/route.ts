import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"
import { getSession } from '@/lib/auth-utils';

/**
 * User location update endpoint
 * 
 * Updates the authenticated user's geographic location coordinates.
 * 
 * @route POST /api/update-location
 * @param req - Request object containing location data
 * @param req.latitude - User's latitude coordinate
 * @param req.longitude - User's longitude coordinate
 * @returns JSON response with success status
 * @throws {401} When user is not authenticated
 * @throws {400} When coordinates are missing
 * @throws {500} When location update fails due to database error
 * 
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { latitude, longitude } = await req.json();
    const userId = session.id; // Replace with session/auth user ID

    if (latitude == null || longitude == null) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    await pool.execute(
      "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?",
      [latitude, longitude, userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}