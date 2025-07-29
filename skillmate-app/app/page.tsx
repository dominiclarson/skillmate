'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Frame, User, MessageCircle, ArrowRight, Star, Users, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { allSections, Skill } from '@/lib/skills';

export default function HomePage() {
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading SkillMate...</p>
        </div>
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
      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="relative flex-1">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
          <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="mb-6">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 mb-4">
                <Star className="w-4 h-4 mr-1" />
                Trusted by 1,000+ Users
              </Badge>
            </div>
            <h1 className="text-6xl font-bold mb-6 tracking-tight">
              Find the Perfect
              <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent block">
                Skill Match
              </span>
            </h1>
            <p className="mb-8 text-xl text-blue-100 max-w-2xl leading-relaxed">
              Connect with trusted local experts—mechanics, chefs, designers, and more. 
              <span className="text-blue-200 font-medium">Your next skill exchange is just a click away.</span>
            </p>

            <div className="relative w-full max-w-lg mb-8">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-sm"></div>
              <div className="relative flex bg-white/20 backdrop-blur-sm rounded-full p-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" size={20} />
                  <Input
                    type="search"
                    placeholder="Search skills like 'web design', 'cooking'..."
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="pl-12 pr-4 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 rounded-full focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <Button 
                  variant="default"
                  size="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2" 
                  onClick={() => console.log('search', query)}
                >
                  <Search size={16} />
                  Search
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="text-sm">1,000+ Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={20} />
                <span className="text-sm">Instant Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} />
                <span className="text-sm">5-Star Rated</span>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Popular Categories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover skilled professionals across various categories
              </p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {filtered.map((skill: Skill) => (
                <Link key={skill.id} href={`/featured`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600">
                    <CardContent className="flex flex-col items-center p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {skill.emoji}
                        </div>
                        <h3 className="font-semibold text-center text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {skill.name}
                        </h3>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-20"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-bold mb-6">Ready to Join SkillMate?</h3>
                <p className="mb-8 text-xl text-blue-100 max-w-2xl mx-auto">
                  Join thousands of skilled professionals and start building meaningful connections in your area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/signup">
                    <Button size="lg" variant="default" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/featured">
                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg rounded-full transition-all duration-200">
                      Browse Skills
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-gradient-to-r from-gray-900 to-gray-800 py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">SkillMate</h3>
              <p className="text-gray-400 mb-6">Connecting skills, building communities</p>
              <div className="text-gray-500">
                © {new Date().getFullYear()} SkillMate. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main dashboard */}
      <main className="flex-1 px-8 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Welcome */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10 flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <User className="text-white" size={48} />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-blue-100 text-xl">
                  Ready to explore new skills and connect with experts?
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/featured">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                        <Frame className="text-blue-600 dark:text-blue-400" size={32} />
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">Featured Skills</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">Explore trending and popular skills in your area</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                        <User className="text-green-600 dark:text-green-400" size={32} />
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Your Profile</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">Manage your skills and personal information</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/chat">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                        <MessageCircle className="text-purple-600 dark:text-purple-400" size={32} />
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">Messages</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">Connect and chat with skill providers</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-fit mx-auto mb-6">
                <Zap className="text-white" size={48} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Share Your Expertise</h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Turn your skills into opportunities. Start helping others in your community and build meaningful connections.
              </p>
              <Link href="/post-request">
                <Button size="lg" variant="default" className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto">
                  <Zap className="w-5 h-5" />
                  Post Your Skill
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}