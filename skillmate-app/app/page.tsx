



'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Frame, User, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { allSections, Skill } from '@/lib/skills';
import { ChatFloatingButton } from '@/components/ChatFloatingButton';
import { AppSidebar } from '@/components/app-sidebar';

export default function HomePage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [query, setQuery] = useState('');

  
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => {
        if (res.ok) setIsAuth(true);
        else setIsAuth(false);
      })
      .catch(() => setIsAuth(false));
  }, []);

 
  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    );
  }

  //  logged out
  if (!isAuth) {
    const featured = allSections.slice(0, 6);
    const filtered = featured.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        

        {/* Hero */}
        <section className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center px-6">
          <h1 className="text-5xl font-extrabold mb-4 text-center">
            Find the Perfect Skill 
          </h1>
          <p className="mb-8 text-lg text-center max-w-xl">
            Connect with trusted local experts—mechanics, chefs, designers, and more.
          </p>


          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <Input
              type="search"
              placeholder="Search skills…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-12 pr-4 w-full rounded-l-lg text-black"
            />
            <Button className="absolute right-0 top-0 h-full rounded-r-lg" onClick={() => console.log('search', query)} variant={undefined} size={undefined}>
              Search
            </Button>
          </div>
        </section>

        {/* Preview Categories */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Popular Categories</h2>
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((skill: Skill) => (
              <Link key={skill.id} href={`/featured`}>
                <Card className="hover:shadow-lg transition transform hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center p-6">
                    <span className="text-4xl mb-2">{skill.emoji}</span>
                    <span className="font-medium text-center">{skill.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Join?</h3>
          <p className="mb-8 text-gray-700 dark:text-gray-300">
            Sign up and start connecting with experts in your area.
          </p>
          <Link href="/signup">
            <Button className="px-8 py-3 text-lg" variant={undefined} size={undefined}>Get Started</Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-6">
          <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} SkillMate. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated dashboard
  const featured = allSections.slice(0, 6);
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
     
      {/* Main dashboard */}
      <main className="flex-1 px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome */}
          <section className="flex items-center space-x-4">
            <User className="text-green-600" size={48} />
            <div>
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
              <p className="text-gray-600 dark:text-gray-300">
                What would you like to do today?
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/featured">
                <Card className="hover:shadow-lg transition p-6">
                  <CardContent className="flex items-center space-x-4">
                    <Frame className="text-indigo-500" size={32} />
                    <div>
                      <h3 className="text-lg font-medium">Featured Skills</h3>
                      <p className="text-gray-500">Explore popular skills</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="hover:shadow-lg transition p-6">
                  <CardContent className="flex items-center space-x-4">
                    <User className="text-green-500" size={32} />
                    <div>
                      <h3 className="text-lg font-medium">Your Profile</h3>
                      <p className="text-gray-500">View and edit your info</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/chat">
                <Card className="hover:shadow-lg transition p-6">
                  <CardContent className="flex items-center space-x-4">
                    <MessageCircle className="text-purple-500" size={32} />
                    <div>
                      <h3 className="text-lg font-medium">Chat</h3>
                      <p className="text-gray-500">Manage conversations</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-white dark:bg-gray-800 rounded-xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4">Offer Your Skill</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Post your own skill and start helping others in your community.
            </p>
            <Link href="/post-request">
              <Button className="px-6 py-2" variant={undefined} size={undefined}>Post a Skill</Button>
            </Link>
          </section>
        </div>
      </main>

      <ChatFloatingButton />
    </div>
  );
}
