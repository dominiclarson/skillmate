



import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-file';
import { changeUserPassword } from '@/lib/user-service';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  try {
    await changeUserPassword(session.user.email, currentPassword, newPassword);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.message === 'Incorrect password' ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
