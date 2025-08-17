import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth-utils";
import { ResultSetHeader } from "mysql2"; 

export const runtime = "nodejs";

type Body = { zip?: string };

export async function POST(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawZip = (body.zip ?? "").trim();
  // normalize to 5 digits; keep leading zeros
  const zip = rawZip.padStart(5, "0").slice(0, 5);

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "ZIP must be 5 digits" }, { status: 400 });
  }

  try {
    // Single UPDATE with JOIN to copy centroid coords from zipcodes
    const [result] = await pool.execute(
  `
  UPDATE Users u
  SET u.latitude  = (SELECT z.latitude  FROM zipcodes z WHERE z.zip = ? LIMIT 1),
      u.longitude = (SELECT z.longitude FROM zipcodes z WHERE z.zip = ? LIMIT 1)
  WHERE u.id = ?
  `,
  [zip, zip, me.id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      // Either ZIP didn’t exist or user id wasn’t found
      // Check ZIP existence to give a precise error:
      const [exists] = await pool.execute(
        "SELECT 1 FROM zipcodes WHERE zip = ? LIMIT 1",
        [zip]
      );
      if (!(exists as any[]).length) {
        return NextResponse.json({ error: "Unknown ZIP" }, { status: 404 });
      }
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the coords we just set (read back once)
    const [rows] = await pool.execute(
      "SELECT latitude, longitude FROM Users WHERE id = ?",
      [me.id]
    );
    // @ts-ignore
    const { latitude, longitude } = rows[0] || {};
    return NextResponse.json({ ok: true, zip, latitude, longitude });
  } catch (e) {
    console.error("location-from-zip error", e);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}