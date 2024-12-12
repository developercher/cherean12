import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UAParser } from 'ua-parser-js';

export async function middleware(request: NextRequest) {
  // Skip API routes and static files
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  try {
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.ip || '';
    const parser = new UAParser(userAgent);

    // Get device and browser info
    const device = parser.getDevice().type || 'Desktop';
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';

    // Store analytics data
    await fetch(`${request.nextUrl.origin}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageUrl: request.nextUrl.pathname,
        userAgent,
        browser,
        device,
        os,
        country: 'Unknown', // You can add proper geolocation later
        city: null,
        ip,
      }),
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}; 