import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityService } from '@/services/securityService';

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check if IP is blocked
  const isAllowed = await securityService.checkIPSecurity(ip);
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  // Rate limiting check
  const rateLimitKey = `ratelimit:${ip}:${request.nextUrl.pathname}`;
  // Implement rate limiting logic here

  // Content security check for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const body = await request.json();
    const hasThreats = await securityService.detectThreats(JSON.stringify(body));
    if (hasThreats) {
      await securityService.logSecurityEvent({
        type: 'threat_detected',
        severity: 'high',
        message: 'Potential security threat detected in request body',
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
      });

      return NextResponse.json(
        { error: 'Invalid request content' },
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 