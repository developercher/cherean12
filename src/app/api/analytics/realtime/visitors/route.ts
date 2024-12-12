import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get visitors from the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await prisma.analytics.aggregateRaw({
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $gte: [
                    "$timestamp",
                    { $literal: fiveMinutesAgo }
                  ]
                },
                {
                  $ne: [
                    "$timestamp",
                    "$$REMOVE"
                  ]
                }
              ]
            }
          }
        },
        {
          $sort: {
            timestamp: -1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            _id: 1,
            pageUrl: 1,
            userAgent: 1,
            browser: 1,
            device: 1,
            os: 1,
            country: 1,
            city: 1,
            ip: 1,
            eventType: 1,
            sessionId: 1,
            referrer: 1,
            timestamp: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$timestamp"
              }
            }
          }
        }
      ]
    }) as any[];

    // Ensure we always return an array
    const visitors = Array.isArray(result) ? result : [];

    return NextResponse.json(visitors);
  } catch (error) {
    console.error('Failed to fetch real-time visitors:', error);
    return NextResponse.json([], { status: 500 });
  }
} 