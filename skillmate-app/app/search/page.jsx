"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SkillOverview } from "@/components/skill-overview";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [activeSection, setActiveSection] = useState([]);

  // URL parameter parsing
  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        if (!searchParams.get("skill") && data.length > 0) {
          setActiveSection(data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch skills:", err));
  }, []);

  useEffect(() => {
    const skillParam = searchParams.get("skill");
    if (skillParam && skills.length > 0) {
      const match = skills.find(
        (s) => s.name === decodeURIComponent(skillParam)
      );
      if (match) {
        setActiveSection(match);
      }
    }
  }, [searchParams, skills]);

  // Handle section change with URL update
  const handleSectionChange = (section) => {
    setActiveSection(section);
    const encodedName = encodeURIComponent(section.name);
    router.push(`/search?skill=${encodedName}`, { scroll: false });
  };
  return (
    
    <SidebarProvider>
      <AppSidebar
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
        skills={skills}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="max-w-5xl container mx-auto px-4">
          <div className="text-4xl font-bold">
            {activeSection.emojiUnicode && (
              <span className="mr-2">{activeSection.emojiUnicode}</span>
            )}
            {activeSection.name} 
          </div>
          <SkillOverview 
            activeSection={activeSection}
            skills={skills}
           />
          <Input
            type="text"
            placeholder="Search skills in this category ..."
            className="w-full"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
