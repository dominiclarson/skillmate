


'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { NavButton } from './NavButton';
import { ThemeButton } from './ThemeButton';

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || 'skm_token';

export default function NavBar() {
  const router = useRouter();
  const isAuth = Boolean(Cookies.get(COOKIE_NAME));

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    Cookies.remove(COOKIE_NAME);
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between">
      <NavButton href="/" label="SkillMate" />

      <div className="flex items-center space-x-4">
        <NavButton href="/" label="Home" />
        {!isAuth && <NavButton href="/login" label="Log In" />}
        {!isAuth && <NavButton href="/signup" label="Sign Up" />}
        {isAuth && <NavButton href="/profile" label="Profile" />}
        {isAuth && <NavButton href="/chat" label="Chat" />}
        <NavButton href="/docs" label="Docs" />
        {isAuth && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
          >
            Log Out
          </button>
        )}
        <ThemeButton current={'light'} onToggle={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>
    </nav>
  );
}
