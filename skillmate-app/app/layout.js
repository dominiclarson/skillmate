import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'SkillMate',
  description: 'Swap skills',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="text-2xl font-bold">
              SkillMate
            </Link>
            <nav className="space-x-6">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <Link href="/login" className="hover:text-gray-700">Login</Link>
              <Link href="/signup" className="hover:text-gray-700">Sign Up</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto py-4 px-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SkillMate. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}