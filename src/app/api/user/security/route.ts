import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
        lastLogin: true,
        loginAttempts: true,
      },
    });

    // Get security logs
    const securityLogs = await prisma.securityLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      ...user,
      securityLogs,
    });
  } catch (error) {
    console.error('Security settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
    });

    // Log the security setting change
    await prisma.securityLog.create({
      data: {
        type: 'change',
        severity: 'low',
        message: 'Security settings updated',
        details: updates,
        userId: session.user.id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Security settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update security settings' },
      { status: 500 }
    );
  }
} 