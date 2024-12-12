import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.sub) {
      // Track user session
      const session = await prisma.userSession.create({
        data: {
          userId: token.sub,
          device: request.headers.get('user-agent') || undefined,
          ip: request.ip || undefined,
        },
      });

      // Track user activity
      await prisma.userActivity.create({
        data: {
          userId: token.sub,
          action: 'page_view',
          target: request.nextUrl.pathname,
          metadata: {
            referrer: request.headers.get('referer'),
            userAgent: request.headers.get('user-agent'),
          },
        },
      });
    }
  } catch (error) {
    console.error('User tracking error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 