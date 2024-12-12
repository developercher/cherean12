import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get total projects
    const totalProjects = await prisma.portfolio.count();

    // Get total views
    const viewsData = await prisma.portfolio.aggregate({
      _sum: {
        views: true,
      },
    });

    // Get total likes
    const likesData = await prisma.portfolio.aggregate({
      _sum: {
        likes: true,
      },
    });

    // Get recent projects
    const recentProjects = await prisma.portfolio.findMany({
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        category: true,
        image: true,
        views: true,
        likes: true,
      },
    });

    // Get popular categories
    const popularCategories = await prisma.portfolio.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
      take: 5,
    });

    return NextResponse.json({
      totalProjects,
      totalViews: viewsData._sum.views || 0,
      totalLikes: likesData._sum.likes || 0,
      recentProjects,
      popularCategories,
    });
  } catch (error) {
    console.error('Failed to fetch portfolio overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio overview' },
      { status: 500 }
    );
  }
} 