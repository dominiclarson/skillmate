


'use client';

import * as React from 'react';
import { Command, Frame, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { skills } from '@/lib/skills';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  avatar: 'user-image.jpg',
};

const projectItems = skills.map(skill => ({
  name: skill.name,
  icon: Frame,
  emoji: skill.emoji,
  description: skill.description,
}));

export function AppSidebar({ onSectionChange, activeSection }) {
  const pathname = usePathname();
  if (pathname !== '/featured') return null;

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <SidebarProvider
      open={isOpen}
      onOpenChange={setIsOpen} className={undefined} style={undefined}>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="p-2 bg-white dark:bg-gray-800 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40 transform transition-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <Sidebar variant="inset" className="h-full flex flex-col">
          {/* Header */}
          <SidebarHeader className="px-6 py-4 flex items-center space-x-3">
            <Command size={28} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">SkillMate</span>
          </SidebarHeader>

          {/* Main nav */}
          <SidebarContent className="flex-1 overflow-y-auto px-4">
            <SidebarMenu className="space-y-2">
              {/* Example static item */}
              <SidebarMenuItem className={undefined}>
                <SidebarMenuButton
                  onClick={() => onSectionChange?.(activeSection)}
                  className="w-full text-left" tooltip={undefined}                >
                  All Skills
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="mt-6">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Skills
              </h3>
              <NavProjects
                projects={projectItems}
                title="Skills"
                onSectionChange={onSectionChange}
                activeSection={activeSection}
              />
            </div>
          </SidebarContent>

          {/* Footer / user info */}
          <SidebarFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <NavUser user={userData} />
          </SidebarFooter>
        </Sidebar>
      </aside>
    </SidebarProvider>
  );
}
