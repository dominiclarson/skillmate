'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'skm_token';

export default function NavBar() {
  const r = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => setIsAuth(!!Cookies.get(cookieName)), []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    Cookies.remove(cookieName);
    r.push('/login');
  }

  return (
    <>
      <Link href="/" className="text-2xl font-bold">SkillMate</Link>
      <div className="space-x-6 text-sm">
        <Link href="/">Home</Link>

        {!isAuth && <Link href="/login">Log In</Link>}
        {!isAuth && <Link href="/signup">Sign Up</Link>}

        {isAuth && (
          <button
            onClick={logout}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
          >
            Log Out
          </button>
        )}
      </div>
    </>
  );
}
