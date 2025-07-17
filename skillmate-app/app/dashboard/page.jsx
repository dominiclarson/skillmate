"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SkillDisplay } from "@/components/skill-display"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { findFirstSection, allSections } from "@/lib/skills"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState(findFirstSection())
  
  // URL parameter parsing
  useEffect(() => {
    const skillParam = searchParams.get('skill')
    if (skillParam) {
      const section = allSections.find(s => s.name === decodeURIComponent(skillParam))
      if (section) {
        setActiveSection(section)
      }
    }
  }, [searchParams])
  
  // Handle section change with URL update
  const handleSectionChange = (section) => {
    setActiveSection(section)
    const encodedName = encodeURIComponent(section.name)
    router.push(`/dashboard?skill=${encodedName}`, { scroll: false })
  }
  return (
    (<SidebarProvider>
      <AppSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
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
