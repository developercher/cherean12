import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    // Get real-time analytics data
    const analytics = await prisma.analytics.findMany({
      where: {
        timestamp: {
          gte: thirtyMinutesAgo,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Process analytics data
    const deviceStats = analytics.reduce((acc: any, curr) => {
      acc[curr.device] = (acc[curr.device] || 0) + 1;
      return acc;
    }, {});

    const browserStats = analytics.reduce((acc: any, curr) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1;
      return acc;
    }, {});

    // Format data for response
    const response = {
      activeVisitors: analytics.length,
      devices: Object.entries(deviceStats).map(([name, value]) => ({
        name,
        value: Math.round((Number(value) / analytics.length) * 100),
      })),
      browsers: Object.entries(browserStats).map(([name, value]) => ({
        name,
        value: Math.round((Number(value) / analytics.length) * 100),
      })),
      recentVisitors: analytics.slice(0, 10).map(visitor => ({
        id: visitor.id,
        page: visitor.pageUrl,
        browser: visitor.browser,
        device: visitor.device,
        country: visitor.country,
        timestamp: visitor.timestamp,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Real-time analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time analytics' },
      { status: 500 }
    );
  }
} 