'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skills, Skill } from '@/lib/skills';
import { AppSidebar } from '@/components/app-sidebar';

export default function PostRequestPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [posting, setPosting] = useState(false);

  // Filter skills based on search term
  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handlePostSkill = async () => {
    if (!selectedSkill || !description.trim() || !price.trim()) {
      return;
    }

    setPosting(true);
    try {
      // TODO: Implement API call to save skill post
      console.log('Posting skill:', {
        skill: selectedSkill,
        description,
        price: parseFloat(price)
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setSelectedSkill(null);
      setDescription('');
      setPrice('');
      setSearchTerm('');
      
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AppSidebar />
      
      <main className="flex-1 max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Post a New Skill</h1>
        
        <div className="space-y-8">
          {/* Skill Selection */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select a Skill</h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedSkill?.id === skill.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{skill.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{skill.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Post Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Post Details</h2>
              
              {/* Selected Skill Display */}
              {selectedSkill && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{selectedSkill.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{selectedSkill.name}</h3>
                      <Badge variant="secondary" className="mt-1">Selected</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSkill.description}
                  </p>
                </div>
              )}
              
              {/* Description Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Skill Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your experience, expertise, and the services you can provide in detail..."
                  rows={6}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/1000 characters
                </p>
              </div>
              
              {/* Price Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Price (per hour) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    USD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set a fair price for your services
                </p>
              </div>
              
              {/* Post Button */}
              <Button
                variant="default"
                // onClick={handlePostSkill}
                disabled={!selectedSkill || !description.trim() || !price.trim() || posting}
                className="w-full"
                size="lg"
              >
                {posting ? 'Posting...' : 'Post Skill'}
              </Button>
              
              {/* Requirements */}
              <div className="mt-4 text-xs text-gray-500">
                <p>* Required fields</p>
                <p>• Select a skill</p>
                <p>• Provide a detailed description</p>
                <p>• Set a fair price</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}