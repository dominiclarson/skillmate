
// app/layout.tsx
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkillMate',
  description: 'Swap skills with peers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-gray-50`}>
       
        <header className="fixed inset-x-0 top-0 z-20 border-b bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
            <NavBar />
          </nav>
        </header>

       
        <main className="mx-auto w-full max-w-4xl flex-grow px-6 pb-16 pt-[76px]">
          {children}
        </main>

       
        <footer className="border-t bg-white py-3 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SkillMate
        </footer>
      </body>
    </html>
  );
}
