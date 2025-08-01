'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Star, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { allSections, Skill } from '@/lib/skills';

export default function UnauthenticatedHome() {
  const [query, setQuery] = useState('');

  const featured = allSections.slice(0, 6);
  const filtered = featured.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <main className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          {/* Hero */}
          <section className="text-center py-16">
            <h1 className="text-4xl font-bold mb-6">
              Find the Perfect Skill Match
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Connect with trusted local experts—mechanics, chefs, designers, and more. 
              Your next skill exchange is just a click away.
            </p>

            <div className="max-w-lg mx-auto mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    type="search"
                    placeholder="Search skills like 'web design', 'cooking'..."
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="default"
                  size="default"
                  className=""
                  onClick={() => console.log('search', query)}
                >
                  <Search size={16} />
                  Search
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span>Instant Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>5-Star Rated</span>
              </div>
            </div>
          </section>

          {/* Popular Categories */}
          <section className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
              <p className="text-muted-foreground">
                Discover skilled professionals across various categories
              </p>
            </div>
            
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {filtered.map((skill: Skill) => (
                <Link key={skill.id} href={`/featured`}>
                  <Card className="border hover:border-primary">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">
                        {skill.emoji}
                      </div>
                      <h3 className="text-sm font-medium">
                        {skill.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="container mx-auto px-4 text-center py-16 border-t">
            <h2 className="text-2xl font-bold mb-4">Ready to Join SkillMate?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of skilled professionals and start building meaningful connections in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="default" className="">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/featured">
                <Button variant="outline" size="lg" className="">
                  Browse Skills
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold mb-2">SkillMate</h3>
          <p className="text-sm text-muted-foreground mb-4">Connecting skills, building communities</p>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SkillMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}