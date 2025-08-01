


'use client';

import Link from 'next/link';

export function NavButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1 font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
    >
      {label}
    </Link>
  );
}
