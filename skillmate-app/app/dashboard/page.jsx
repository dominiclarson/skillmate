"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SkillDisplay } from "@/components/skill-display"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { findFirstSection } from "@/lib/skills"

export default function Page() {
  const [activeSection, setActiveSection] = useState(findFirstSection())
  return (
    (<SidebarProvider>
      <AppSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <span>
              {activeSection.emoji && <span className="mr-2">{activeSection.emoji}</span>}
              {activeSection.name}
            </span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SkillDisplay activeSection={activeSection} />
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
