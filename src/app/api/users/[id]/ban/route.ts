import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { duration, reason } = await request.json();

    // Calculate ban end date
    let bannedUntil: Date | null = null;
    switch (duration) {
      case '1h':
        bannedUntil = new Date(Date.now() + 60 * 60 * 1000);
        break;
      case '24h':
        bannedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        break;
      case '7d':
        bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        bannedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'permanent':
        bannedUntil = new Date('2099-12-31');
        break;
    }

    // Update user status
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        status: 'banned',
        bannedUntil,
        banReason: reason,
        activities: {
          create: {
            action: 'banned',
            metadata: {
              duration,
              reason,
              bannedUntil,
            },
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json(
      { error: 'Failed to ban user' },
      { status: 500 }
    );
  }
} 