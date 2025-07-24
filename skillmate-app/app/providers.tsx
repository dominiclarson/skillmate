





'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider, useTheme } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { findFirstSection } from '@/lib/skills';
import { Sun, Moon, MessageCircle } from 'lucide-react';

export default function Providers({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(findFirstSection());
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Check session on route change
  useEffect(() => {
    let alive = true;
    fetch('/api/auth/session')
      .then(res => alive && setAuthenticated(res.ok))
      .catch(() => alive && setAuthenticated(false));
    return () => { alive = false; };
  }, [pathname]);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (authenticated === null || !mounted) {
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const handleSectionChange = (sec: typeof activeSection) =>
    setActiveSection(sec);

  //  header/nav
  const Header = () => {
    const navItems = [
      { href: '/', label: 'Home' },
      { href: '/featured', label: 'Featured' },
      { href: '/profile', label: 'Profile' },
      { href: '/chat', label: 'Chat' },
    ];

    return (
      <header className="bg-white dark:bg-black shadow sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
            SkillMate
          </Link>

          <nav className="flex items-center space-x-4">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition
                    ${isActive
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

            {!authenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
                {/* Chat button*/}
                <Link href="/chat" className="px-2 py-2 text-gray-800 dark:text-gray-200 hover:text-blue-500">
                  <MessageCircle size={20} />
                </Link>
              </>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="ml-4 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>
    );
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastContainer position="bottom-right" />

      {/* Always show Header */}
      <Header />

      {pathname.startsWith('/featured') ? (
        // Featured layout: full-width, no sidebar
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      ) : (
        // Default layout: sidebar + centered content
        <div className="flex">
          
          <main className="flex-1 px-6 py-8 container mx-auto">
            {children}
          </main>
        </div>
      )}

    
    </ThemeProvider>
  );
}
