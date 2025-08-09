'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuickScheduleDialog from '@/components/QuickScheduleDialog';


type Teacher = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
};


type SkillInfo = {
  id: number;
  name: string;
  emoji?: string;
  description?: string;
};

/**
 * Individual skill page displaying available teachers and booking interface.
 * 
 * This component provides a page for each skill category, showing
 * all available teachers who offer that skill along with their profiles and
 * direct booking capabilities. It uses dynamic routing to load skill-specific
 * content and teacher listings.
 * 
 * @component
 * @features
 * - **Responsive Grid**: Mobile-optimized teacher card layout
 * 
 * @dependencies
 * - React hooks for state and effect management
 * - Next.js router for dynamic parameter access
 * - QuickScheduleDialog component for session booking
 * - Custom API endpoints for skills and teacher data
 * 
 * @returns {JSX.Element} The rendered skill page with teacher listings and booking
 */
export default function SkillTeachersPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [skill, setSkill] = useState<SkillInfo | null>(null);
  const skillId = Number(params.id);

  useEffect(() => {
    if (!skillId) return;
    
    fetch('/api/skills', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then((rows: any[]) => {
        const found = rows.find(s => Number(s.id) === skillId);
        if (found) setSkill({ id: Number(found.id), name: found.name, emoji: found.emoji, description: found.description });
      })
      .catch(() => {});
    fetch(`/api/skills/teachers?skillId=${skillId}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, [skillId]);

     return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        {skill?.emoji && <span className="text-3xl">{skill.emoji}</span>}
        <h1 className="text-3xl font-bold">{skill?.name || `Skill #${skillId}`}</h1>
      </div>
      {skill?.description && <p className="text-muted-foreground">{skill.description}</p>}

      <h2 className="text-xl font-semibold mt-6">Teachers</h2>
         {teachers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No teachers yet for this skill.</p>
         ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {teachers.map(t => (
            <li key={t.id} className="border rounded-lg p-4 flex flex-col gap-2">
              <div className="font-semibold">{t.name || t.email}</div>
              {t.bio && <div className="text-sm text-muted-foreground line-clamp-3">{t.bio}</div>}
              <div className="flex justify-end">
                <QuickScheduleDialog teacher={t} />
              </div>
               </li>
             ))}
           </ul>
         )}
       </main>
     );
   }
   