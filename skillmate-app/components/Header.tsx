'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, MessageCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from './theme-toggle';

interface HeaderProps {
  authenticated: boolean;
  onLogout: () => void;
}

export default function Header({ authenticated, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/featured', label: 'Featured' },
    { href: '/sessions', label: 'Scheduling' },    
    { href: '/notifications', label: 'Notifications' }, 
    { href: '/profile', label: 'Profile' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
            SkillMate
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size="sm"
                className=""
                asChild
              >
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            ))}

            <Separator orientation="vertical" className="h-6 mx-2" />

            {!authenticated ? (
              <>
                <Button variant="default" size="sm" className="text-white" asChild>
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="" asChild>
                  <Link href="/signup">
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  className=""
                  onClick={onLogout}
                >
                  Logout
                </Button>
                <Button variant="ghost" size="icon" className="" asChild>
                  <Link href="/chat" aria-label="Chat">
                    <MessageCircle size={20} />
                  </Link>
                </Button>
              </>
            )}

            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="" aria-label="Menu">
                  <Menu size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map(item => (
                  <DropdownMenuItem key={item.href} className="" inset={false} asChild>
                    <Link 
                      href={item.href}
                      className={isActive(item.href) ? "bg-accent" : ""}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="" />
                
                {!authenticated ? (
                  <>
                    <DropdownMenuItem className="" inset={false} asChild>
                      <Link href="/login">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="" inset={false} asChild>
                      <Link href="/signup">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="" inset={false} asChild>
                      <Link href="/chat" className="flex items-center space-x-2">
                        <MessageCircle size={16} />
                        <span>Chat</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onLogout}
                      variant="destructive"
                      className=""
                      inset={false}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}