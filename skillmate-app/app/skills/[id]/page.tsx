'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import QuickScheduleDialog from '@/components/QuickScheduleDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';


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
  const [distance, setDistance] = useState(10);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<null | string>(null);

async function saveZip() {
    setStatus("Saving...");
    const res = await fetch("/api/profile/locationzip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed");
      return;
    }
    setStatus(`Saved: ${data.latitude}, ${data.longitude}`);
    setLng(data.longitude);
    setLat(data.latitude);
  }


// 1) Geo-filtered teacher fetch (debounced)
useEffect(() => {
  if (!skillId) return;
  if (lat == null || lng == null) return;

  const controller = new AbortController();
  const t = setTimeout(() => {
    fetch(
      `/api/skills/teachers?lat=${lat}&lng=${lng}&radiusMi=${distance}&skillId=${skillId}`,
      { cache: 'no-store', signal: controller.signal }
    )
      .then(r => r.ok ? r.json() : [])
      .then(setTeachers)
      .catch((e) => {
        if (e.name !== 'AbortError') setTeachers([]);
      });
  }, 250);

  return () => {
    controller.abort();
    clearTimeout(t);
  };
}, [skillId, lat, lng, distance]);

// 2) Skill fetch 
useEffect(() => {

  fetch('/api/skills', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .then((rows: any[]) => {
      const found = rows.find(s => Number(s.id) === skillId);
      if (found) {
        setSkill({
          id: Number(found.id),
          name: found.name,
          emoji: found.emoji,
          description: found.description
        });
      }
    })
    .catch(() => {});
}, [skillId]);
//Location polling
useEffect(() => {
  if (!skillId) return;
  fetch('/api/profile/location')
    .then(r => r.ok ? r.json() : { latitude: null, longitude: null })
    .then(data => {
      setLat(data.latitude);
      setLng(data.longitude);
    })
    .catch(() => {
    })
  console.log('fetching with', { lat, lng, radiusMi: distance, skillId });
},[skillId]);

     return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        {skill?.emoji && <span className="text-3xl">{skill.emoji}</span>}
        <h1 className="text-3xl font-bold">{skill?.name || `Skill #${skillId}`}</h1>
      </div>
      {skill?.description && <p className="text-muted-foreground">{skill.description}</p>}
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Location Settings</h2>
          <p className="text-sm text-muted-foreground mb-4">Set your ZIP code to find nearby teachers</p>
          <div className="flex items-center gap-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-24"
              placeholder="e.g. 02108"
            />
            <Button onClick={saveZip}>
              Use ZIP
            </Button>
          </div>
          {status && <Badge variant="secondary" className="mt-2">{status}</Badge>}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Search Radius</h2>
          <p className="text-sm text-muted-foreground mb-4">Adjust the search radius to find teachers within {distance} miles</p>
          <Slider
            value={[distance]}
            onValueChange={(value) => setDistance(value[0])}
            max={100}
            min={1}
            step={1}
            className="w-full max-w-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Available Teachers</h2>
          <p className="text-sm text-muted-foreground mb-4">Teachers offering this skill in your area</p>
          {teachers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teachers yet for this skill.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {teachers.map(t => (
                <div key={t.id} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{t.name || t.email}</h3>
                    {t.bio && <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{t.bio}</p>}
                  </div>
                  <div className="flex justify-end">
                    <QuickScheduleDialog teacher={t} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
   }
   