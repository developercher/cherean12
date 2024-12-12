import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (range) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }

    // Get analytics data
    const analytics = await prisma.analytics.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Get page views
    const pageViews = await prisma.pageView.findMany({
      orderBy: {
        views: 'desc',
      },
      take: 10,
    });

    // Process data for response
    const stats = [
      {
        label: 'Total Visitors',
        value: analytics.length,
        trend: 12.5, // Calculate actual trend
      },
      {
        label: 'Page Views',
        value: pageViews.reduce((sum, page) => sum + page.views, 0),
        trend: 8.2,
      },
      {
        label: 'Avg. Session Duration',
        value: '2m 45s',
        trend: -3.1,
      },
      {
        label: 'Bounce Rate',
        value: '42.3%',
        trend: -5.7,
      },
    ];

    // Process traffic data
    const traffic = processTrafficData(analytics);
    const browsers = processBrowserStats(analytics);
    const devices = processDeviceStats(analytics);
    const locations = processLocationData(analytics);
    const pages = processPageViews(pageViews);

    return NextResponse.json({
      stats,
      traffic,
      browsers,
      devices,
      locations,
      pages,
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Helper functions for data processing
function processTrafficData(analytics: any[]) {
  // Group by date and count visitors
  const grouped = analytics.reduce((acc: any, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(grouped),
    pageviews: Object.values(grouped),
    visitors: Object.values(grouped).map((v: any) => Math.round(v * 0.7)), // Estimate unique visitors
  };
}

function processBrowserStats(analytics: any[]) {
  const browsers = analytics.reduce((acc: any, item) => {
    acc[item.browser] = (acc[item.browser] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(browsers),
    values: Object.values(browsers),
  };
}

function processDeviceStats(analytics: any[]) {
  const devices = analytics.reduce((acc: any, item) => {
    acc[item.device] = (acc[item.device] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(devices),
    values: Object.values(devices),
  };
}

function processLocationData(analytics: any[]) {
  const locations = analytics.reduce((acc: any, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(locations).map(([country, count]) => ({
    country,
    count,
  }));
}

function processPageViews(pageViews: any[]) {
  return pageViews.map(page => ({
    url: page.url,
    views: page.views,
    uniqueViews: page.uniqueViews,
  }));
} 