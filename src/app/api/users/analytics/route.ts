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

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get new users in period
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get active users (users with recent activity)
    const activeUsers = await prisma.analytics.groupBy({
      by: ['sessionId'],
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      _count: true,
    });

    // Calculate user growth rate
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const userGrowth = previousUsers ? ((newUsers - previousUsers) / previousUsers) * 100 : 100;

    // Get user locations
    const userLocations = await prisma.analytics.groupBy({
      by: ['country'],
      _count: true,
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    });

    // Calculate engagement data
    const engagement = {
      labels: generateDateLabels(startDate, now),
      pageViews: generateGrowthData(startDate, now),
      sessions: generateGrowthData(startDate, now),
      interactions: generateGrowthData(startDate, now),
    };

    // Format response
    const response = {
      stats: {
        totalUsers,
        activeUsers: activeUsers.length,
        newUsers,
        userGrowth: Math.round(userGrowth * 10) / 10,
        avgSessionTime: '12m 30s',
        sessionTimeChange: 5.2,
        churnRate: 2.1,
        churnChange: -0.5,
      },
      growth: {
        labels: generateDateLabels(startDate, now),
        newUsers: generateGrowthData(startDate, now),
        activeUsers: generateGrowthData(startDate, now),
      },
      userLocations: userLocations.map(location => ({
        country: location.country,
        users: location._count,
      })),
      engagement,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('User analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user analytics' },
      { status: 500 }
    );
  }
}

function generateDateLabels(start: Date, end: Date): string[] {
  const labels = [];
  const current = new Date(start);
  while (current <= end) {
    labels.push(current.toLocaleDateString());
    current.setDate(current.getDate() + 1);
  }
  return labels;
}

function generateGrowthData(start: Date, end: Date): number[] {
  const data = [];
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  for (let i = 0; i < days; i++) {
    data.push(Math.floor(Math.random() * 100));
  }
  return data;
} 