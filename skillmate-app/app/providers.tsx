'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun, Moon, MessageCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavButton } from '@/components/NavButton';
import { ThemeButton } from '@/components/ThemeButton';
import { ChatFloatingButton } from '@/components/ChatFloatingButton';

export default function Providers({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();
  const router = useRouter();

  // Check auth 
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => setAuthenticated(res.ok))
      .catch(() => setAuthenticated(false));
  }, [pathname]);

  // Load theme 
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
    else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    router.push('/login');
    toast('Logged out successfully');
  };

  return (
    <>
      {/* Notification container */}
      <ToastContainer position="bottom-right" />

      {/* Header */}
      <header className="bg-white dark:bg-black shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
            SkillMate
          </Link>
          <nav className="flex items-center space-x-4 text-gray-800 dark:text-gray-200">
            {!authenticated ? (
              <>
                <NavButton href="/login" label="Login" />
                <NavButton href="/signup" label="Sign Up" />
              </>
            ) : (
              <button onClick={handleLogout} className="focus:outline-none">
                <MessageCircle size={20} className="inline mr-1" /> Logout
              </button>
            )}
            <ThemeButton current={theme} onToggle={toggleTheme} />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto py-4 px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SkillMate. All rights reserved.
        </div>
      </footer>

      {/* Floating Chat Button */}
      {authenticated && <ChatFloatingButton />}
    </>
  );
}