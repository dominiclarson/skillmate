'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { skills, Skill } from '@/lib/skills';


/**
 * Skill posting and service creation page.
 * 
 * This component allows authenticated users to create and publish skill-based
 * service offerings with descriptions, pricing, and skill selection.
 * 
 * @component
 * @features
 * - **Visual Skill Browser**: Interactive grid with emojis and descriptions
 * - **Form Validation**: Ensure required fields are completed
 * - **Responsive Layout**: main content area

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
        Loading…
      </div>
    );
  }

  return (
      
      <main className="flex-1 max-w-4x1 mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Post a New Skill</h1>
          {/* Post Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Post Details</h2>
                  {/* Skill Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Skill name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter Skill Name here"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Our admins will review your suggestions!
                </p>
              </div>
              {/* Description Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Skill Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your skill that you think we're missing!"
                  rows={6}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/1000 characters
                </p>
              </div>
              {/* Post Button */}
              <Button
                variant="default"
                onClick={handlePostSkill}
                disabled={!description.trim() || !name.trim() || posting}
                className="w-full"
                size="lg"
              >
                {posting ? 'Posting...' : 'Post Skill'}
              </Button>
              {/* Requirements */}
              <div className="mt-4 text-xs text-gray-500">
                <p>* Required fields</p>
                <p>• Please provide a detailed description</p>
              </div>
            </Card>
          </div>
      </main>
  );
}