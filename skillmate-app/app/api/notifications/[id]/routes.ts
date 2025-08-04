

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export const runtime = 'nodejs';

/* mark as read */
export async function PATCH(req: Request, { params }: { params:{ id:string }}) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error:'Unauthorized' }, { status:401 });

  await pool.execute(
    'UPDATE Notifications SET read_at = UTC_TIMESTAMP() WHERE id = ? AND user_id = ?',
    [Number(params.id), me.id]
  );
  return NextResponse.json({ ok:true });
}

/*  delete */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const me = await getSession();
    if (!me)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
    await pool.execute(
      `UPDATE Notifications
         SET dismissed_at = UTC_TIMESTAMP()
       WHERE id = ? AND user_id = ?`,
      [Number(params.id), me.id]
    );
  
    return NextResponse.json({ ok: true });
  }