import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"
import { getSession } from '@/lib/auth-utils';

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