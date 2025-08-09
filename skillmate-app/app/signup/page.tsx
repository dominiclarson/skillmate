'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'react-toastify';
import Link from 'next/link';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1,  'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success('Account created successfully!');
        router.push(callbackUrl);
      } else {
        toast.error(data.error || 'Signup failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-muted to-secondary px-4 py-12 flex-1">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">
            Create Account
          </CardTitle>
          <CardDescription className="">
            Sign up to join SkillMate community
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem className={undefined}>
                    <FormLabel className={undefined}>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="joe" {...field} />
                    </FormControl>
                    <FormMessage className={undefined} />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem className={undefined}>
                    <FormLabel className={undefined}>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="doe" {...field} />
                    </FormControl>
                    <FormMessage className={undefined} />
                  </FormItem>
                );
              }}
            />
  


              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className=""/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="At least 6 characters"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="default" size="default" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
