import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth-utils"; 

export async function GET() {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await pool.execute(
    "SELECT latitude, longitude FROM Users WHERE id = ?",
    [me.id]
  );

  if (!rows || !rows[0]) {
    return NextResponse.json({ latitude: null, longitude: null });
  }

  return NextResponse.json(rows[0]);
}
