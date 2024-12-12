import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/auth/callback/credentials') {
    const email = request.body?.get('email');
    
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email as string },
      });

      if (user) {
        // Check if user is banned
        if (user.status === 'banned') {
          if (user.bannedUntil && user.bannedUntil > new Date()) {
            return NextResponse.json(
              { error: `Account banned until ${user.bannedUntil}. Reason: ${user.banReason}` },
              { status: 403 }
            );
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

        // Track login attempt
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            ip: request.ip,
            userAgent: request.headers.get('user-agent') || undefined,
            success: false,
            reason: 'Attempted login',
          },
        });

        // Increment login attempts
        if (user.loginAttempts >= 5) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: 'banned',
              bannedUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
              banReason: 'Too many failed login attempts',
              loginAttempts: 0,
            },
          });

          return NextResponse.json(
            { error: 'Account temporarily locked due to too many failed attempts' },
            { status: 403 }
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: {
              increment: 1,
            },
          },
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/auth/callback/credentials',
}; 