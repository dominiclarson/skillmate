



'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Frame, User, MessageCircle, Home, Calendar, Bell } from 'lucide-react';
import type { Skill } from '@/lib/skills';  

export function AppSidebar(props: {
  activeSection?: Skill;
  onSectionChange?: (sec: Skill) => void;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/featured', label: 'Featured', icon: Frame },
    { href: '/sessions', label: 'Scheduling', icon: Calendar },     
    { href: '/notifications', label: 'Notifications', icon: Bell },  
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-lg z-30">
      <div className="h-full flex flex-col py-6 px-4">
        <nav className="flex-1 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition
                  ${isActive
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                <Icon className="mr-3" size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
