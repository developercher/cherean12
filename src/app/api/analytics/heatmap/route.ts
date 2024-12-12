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

    // Get click data from the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.analytics.aggregateRaw({
      pipeline: [
        {
          $match: {
            eventType: 'click',
            $expr: {
              $and: [
                {
                  $gte: [
                    "$timestamp",
                    { $literal: oneDayAgo }
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              x: "$clickX",
              y: "$clickY",
              pageUrl: "$pageUrl"
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            x: "$_id.x",
            y: "$_id.y",
            pageUrl: "$_id.pageUrl",
            value: "$count"
          }
        }
      ]
    }) as any[];

    const clickData = Array.isArray(result) ? result : [];

    return NextResponse.json(clickData);
  } catch (error) {
    console.error('Failed to fetch heatmap data:', error);
    return NextResponse.json([], { status: 500 });
  }
} 