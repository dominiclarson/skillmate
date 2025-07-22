"use client"

import { MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
  title = "Projects",
  onSectionChange,
  activeSection
}) {
  const { isMobile } = useSidebar()

  return (
    (<SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className={undefined}>{title}</SidebarGroupLabel>
      <SidebarMenu className={undefined}>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name} className={undefined}>
            <SidebarMenuButton 
              onClick={() => onSectionChange?.(item)}
              isActive={activeSection?.name === item.name} tooltip={undefined} className={undefined}            >
              {item.emoji ? (
                <span className="text-base">{item.emoji}</span>
              ) : (
                <item.icon />
              )}
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className={undefined}>
          <SidebarMenuButton tooltip={undefined} className={undefined}>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>)
  );
}
