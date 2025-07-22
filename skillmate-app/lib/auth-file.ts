




import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail, verifyPassword } from '@/lib/auth-utils';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      // Note the second `req` param to match NextAuth types:
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing credentials');
        }
        const userRecord = await findUserByEmail(credentials.email);
        if (!userRecord) {
          throw new Error('No user found with that email');
        }
        const valid = await verifyPassword(credentials.password, userRecord.hash);
        if (!valid) {
          throw new Error('Incorrect password');
        }
        // Return a User object with string `id`:
        return {
          id: String(userRecord.id),
          email: userRecord.email,
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user!,
          id: token.id as string,
          email: token.email as string,
        } as { name?: string; email?: string; image?: string; id: string }; // Extend user type
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
