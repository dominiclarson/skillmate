

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export const runtime = 'nodejs';


export async function GET() {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [rows] = await pool.execute(
    `SELECT *
       FROM Notifications
      WHERE user_id = ?
        AND dismissed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 100`,
    [me.id]
  );

  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'no-store' },
  });
}


 
 export async function PATCH() {
  const me = await getSession();
   if (!me)
   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await pool.execute(
         `UPDATE Notifications
        SET read_at = UTC_TIMESTAMP()
     WHERE user_id = ?
        AND read_at IS NULL`,
            [me.id]
   );

   return NextResponse.json({ ok: true });
 }
