import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    await prisma.$connect();
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';

    // Get date range
    const now = new Date();
    const startDate = new Date();
    if (range === 'week') startDate.setDate(now.getDate() - 7);
    else if (range === 'month') startDate.setDate(now.getDate() - 30);
    else if (range === 'year') startDate.setDate(now.getDate() - 365);

    // Get total posts
    const totalPosts = await prisma.post.count();

    // Get posts in date range
    const recentPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get total views
    const posts = await prisma.post.findMany({
      select: {
        views: true,
      },
    });
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

    // Get daily views for chart
    const dailyPosts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        views: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group posts by date and sum views
    const dailyViews = dailyPosts.reduce((acc: any[], post) => {
      const date = new Date(post.createdAt).toISOString().split('T')[0];
      const existingDate = acc.find(item => item.createdAt === date);
      
      if (existingDate) {
        existingDate._sum.views += post.views || 0;
      } else {
        acc.push({
          createdAt: date,
          _sum: { views: post.views || 0 }
        });
      }
      
      return acc;
    }, []);

    // Get popular posts
    const popularPosts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        views: 'desc',
      },
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent activities
    const recentActivities = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate previous period views
    const previousPosts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
          lt: startDate,
        },
      },
      select: {
        views: true,
      },
    });
    const previousViews = previousPosts.reduce((sum, post) => sum + (post.views || 0), 0);

    // Calculate view change percentage
    const viewsChange = previousViews ? ((totalViews - previousViews) / previousViews) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalViews,
        viewsChange: viewsChange.toFixed(1),
        totalPosts,
        postsChange: ((recentPosts / totalPosts) * 100).toFixed(1),
      },
      charts: {
        dailyViews: dailyViews || [],
      },
      popularPosts,
      recentActivities,
    });
  } catch (error) {
    console.error('Analytics error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? `Database error: ${error.message}` 
          : 'Failed to connect to database'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 