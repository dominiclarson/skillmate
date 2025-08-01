'use client';

import React from 'react';
import Link from 'next/link';
import { Frame, User, MessageCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthenticatedDashboard() {
  return (
    <div className="container mx-auto flex flex-col min-h-screen">
      {/* Main dashboard */}
      <main className="flex-1 px-4 py-10 bg-background">
        <div className="space-y-12">
          {/* Welcome */}
          <section className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10 flex items-center space-x-6">
              <div className="bg-background/20 backdrop-blur-sm p-4 rounded-2xl">
                <User className="text-white" size={48} />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2 text-white">Welcome Back!</h1>
                <p className="text-white text-xl">
                  Ready to explore new skills and connect with experts?
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/featured">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-card hover:bg-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Frame className="text-primary" size={32} />
                      </div>
                      <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-card-foreground group-hover:text-accent-foreground">Featured Skills</CardTitle>
                    <p className="text-muted-foreground">Explore trending and popular skills in your area</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-card hover:bg-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-secondary/50 p-3 rounded-xl group-hover:bg-secondary transition-colors">
                        <User className="text-secondary-foreground" size={32} />
                      </div>
                      <ArrowRight className="text-muted-foreground group-hover:text-secondary-foreground group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-card-foreground group-hover:text-accent-foreground">Your Profile</CardTitle>
                    <p className="text-muted-foreground">Manage your skills and personal information</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/chat">
                <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-card hover:bg-accent">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-accent/50 p-3 rounded-xl group-hover:bg-accent transition-colors">
                        <MessageCircle className="text-accent-foreground" size={32} />
                      </div>
                      <ArrowRight className="text-muted-foreground group-hover:text-accent-foreground group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl mb-2 text-card-foreground group-hover:text-accent-foreground">Messages</CardTitle>
                    <p className="text-muted-foreground">Connect and chat with skill providers</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10">
              <div className="bg-background/20 backdrop-blur-sm p-4 rounded-2xl w-fit mx-auto mb-6">
                <Zap className="text-white" size={48} />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-white">Share Your Expertise</h2>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                Turn your skills into opportunities. Start helping others in your community and build meaningful connections.
              </p>
              <Link href="/post-request">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto">
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