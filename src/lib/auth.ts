import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('No user found');
        }

        // Check if user is banned
        if (user.status === 'banned') {
          if (user.bannedUntil && user.bannedUntil > new Date()) {
            throw new Error(`Account banned until ${user.bannedUntil}. Reason: ${user.banReason}`);
          } else {
            // Unban user if ban period is over
            await prisma.user.update({
              where: { id: user.id },
              data: {
                status: 'active',
                bannedUntil: null,
                banReason: null,
              },
            });
          }
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          // Increment login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: {
                increment: 1,
              },
            },
          });

          // Check if should ban user
          if (user.loginAttempts >= 4) { // Will become 5 after this attempt
            await prisma.user.update({
              where: { id: user.id },
              data: {
                status: 'banned',
                bannedUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
                banReason: 'Too many failed login attempts',
                loginAttempts: 0,
              },
            });
            throw new Error('Account temporarily locked due to too many failed attempts');
          }

          throw new Error('Invalid password');
        }

        // Reset login attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lastLogin: new Date(),
          },
        });

        // Create login history entry
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            success: true,
            reason: 'Successful login',
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 