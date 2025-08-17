'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { skills, Skill } from '@/lib/skills';
import { AppSidebar } from '@/components/app-sidebar';

/**
 * Skill posting and service creation page.
 * 
 * This component allows authenticated users to create and publish skill-based
 * service offerings with descriptions, pricing, and skill selection.
 * 
 * @component
 * @features
 * - **Skill Selection**: Browse and search through available skill categories
 * - **Service Creation**: Form for service descriptions and pricing
 * - **Visual Skill Browser**: Interactive grid with emojis and descriptions
 * - **Form Validation**: Ensure required fields are completed
 * - **Responsive Layout**: Sidebar navigation with main content area

 * @dependencies
 * - React hooks for state and effect management
 * - Next.js router for navigation and authentication
 * - shadcn/ui components for consistent interface
 * - AppSidebar component for navigation
 * - Skills library for available skill categories
 * 
 * @returns {JSX.Element} The rendered skill posting interface with form and navigation
 */
export default function PostRequestPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState('');

  // Load session
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => {
        if (!res.ok) {
          router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then(session => {
        setUser(session.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname, router]);
   //handles the passing of info to db
  const handlePostSkill = async () => {
    if (!name.trim() || !description.trim() ) {
      return;
    }

    setPosting(true);
    try {
      console.log('Posting skill:', {
        skill: selectedSkill,
        description,
      })
        const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
        }
    
    );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset form
      setDescription('');
      setName('');
      // Show success message or redirect
      alert('Skill posted successfully!');
    
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <main className="flex-1 container mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Post a New Skill</h1>
          <p className="text-muted-foreground">
            Suggest a new skill that you think we should add to our platform.
          </p>
        </div>

        <Card className="">
          <CardHeader className="">
            <CardTitle className="">Skill Details</CardTitle>
            <CardDescription className="">
              Provide information about the skill you'd like to suggest.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="" htmlFor="skill-name">
                Skill name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter Skill Name here"
                className=""
              />
              <p className="text-xs text-muted-foreground">
                Our admins will review your suggestions!
              </p>
            </div>

            <div className="space-y-2">
              <Label className="" htmlFor="skill-description">
                Skill Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="skill-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your skill that you think we're missing!"
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/1000 characters
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handlePostSkill}
                variant="default"
                disabled={!description.trim() || !name.trim() || posting}
                className="w-full"
                size="lg"
              >
                {posting ? 'Posting...' : 'Post Skill'}
              </Button>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>* Required fields</p>
                <p>• Please provide a detailed description</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}