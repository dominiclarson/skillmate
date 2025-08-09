'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { skills, Skill } from '@/lib/skills';
import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';
import { SkillOverview } from '@/components/skill-overview';


interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Featured Skills page component that displays a comprehensive skill marketplace.
 * 
 * This component serves as the main discovery page for the SkillMate platform,
 * allowing users to browse, search, and explore available skills. It includes
 * geolocation functionality for location-based matching and user authentication
 * status tracking.
 * 
 * @component
 * 
 * @features
 * - **Skill Discovery**: Browse all available skills in a responsive grid layout
 * - **Search Functionality**: Real-time search filtering with clear button
 * - **Geolocation**: Automatic location detection for personalized matching
 * - **Authentication Awareness**: Shows different content based on auth status
 * - **Interactive Overview**: Detailed skill information display
 * - **Responsive Design**: Optimized for mobile, tablet, and desktop
 * 
 * @dependencies
 * - React hooks for state management
 * - Next.js Link for client-side navigation
 * - Lucide React for icons
 * - Custom UI components from shadcn/ui
 * - Skills data from centralized skills library
 * 
 * @returns {JSX.Element} The rendered Featured Skills page
 */
export default function FeaturedPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<Skill>(skills[0]);
  const [location, setLocation] = useState<Location | null>(null);
  
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, []);
  /*used to find location to match users*/
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coords: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLocation(coords);

          fetch("/api/update-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
          });
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location:", error);
        },
        options
      );
    }
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
    <main className="container mx-auto px-4 py-8 space-y-8">
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
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredSkills.map(skill => (
              <Link key={skill.id} href={`/skills/${skill.id}`}>
                <div
                  className={`group cursor-pointer transform transition duration-200
                    hover:scale-105 hover:shadow-lg rounded-lg border p-6 flex flex-col items-center
                    h-40 justify-center
                    ${activeSection.id === skill.id
                      ? 'bg-accent border-primary text-accent-foreground'
                      : 'bg-card border-border text-card-foreground hover:bg-accent/50'
                    }`}
                >
                  <span className="text-4xl mb-3">{skill.emoji}</span>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors text-center leading-tight line-clamp-2">
                    {skill.name}
                  </span>
                </div>
              </Link>
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
  );
}
