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
      select: { notificationPreferences: true },
    });

    // Return default preferences if none exist
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: false,
      soundEnabled: true,
      desktopNotifications: false,
      notifyOnNewUsers: true,
      notifyOnNewPosts: true,
      notifyOnComments: true,
      notifyOnMentions: true,
      browserNotifications: false,
      securityAlerts: true,
      maintenanceAlerts: true,
      digestEmails: 'never',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00',
      },
    };

    return NextResponse.json(user?.notificationPreferences || defaultPreferences);
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
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
      data: {
        notificationPreferences: {
          set: updates,
        },
      },
    });

    return NextResponse.json(user.notificationPreferences);
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 