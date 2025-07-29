

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { skills, Skill } from '@/lib/skills';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';
import { SkillOverview } from '@/components/skill-overview';
import { AppSidebar } from '@/components/app-sidebar';

export default function FeaturedPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<Skill>(skills[0]);


  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, []);

  
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;
    const q = searchTerm.toLowerCase();
    return skills.filter(s => s.name.toLowerCase().includes(q));
  }, [searchTerm]);

  const selectSkill = useCallback((skill: Skill) => {
    setActiveSection(skill);
  }, []);
  const clearSearch = () => setSearchTerm('');

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header & Search */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold text-foreground">Featured Skills</h1>
          <div className="relative mt-4 sm:mt-0 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Search skills"
              placeholder="Search skills…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 w-full sm:w-80 rounded-lg"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Overview */}
        <SkillOverview activeSection={activeSection} />

      
        {/* Skill Grid */}
        {filteredSkills.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No skills match "{searchTerm}".
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredSkills.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => selectSkill(skill)}
                className={`group focus:outline-none transform transition duration-200
                  hover:scale-105 hover:shadow-lg rounded-lg border p-6 flex flex-col items-center
                  ${
                    activeSection.id === skill.id
                      ? 'bg-accent border-primary text-accent-foreground'
                      : 'bg-card border-border text-card-foreground hover:bg-accent/50'
                  }`}
              >
                <span className="text-5xl mb-4">{skill.emoji}</span>
                <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
              </button>
            ))}
          </div>
        )}

        
        {/* Connections */}
        {isAuth && (
          <div className="pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Your Connections</h2>
            <p className="text-muted-foreground">
              Manage your chats on the{' '}
              <Link href="/chat" className="text-primary hover:underline">
                Chat page
              </Link>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
