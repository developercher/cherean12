import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get views by category
    const viewsByCategory = await prisma.portfolio.groupBy({
      by: ['category'],
      _sum: {
        views: true,
      },
      orderBy: {
        _sum: {
          views: 'desc',
        },
      },
    });

    // Get projects by category
    const projectsByCategory = await prisma.portfolio.groupBy({
      by: ['category'],
      _count: true,
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    // Get projects by status
    const projectsByStatus = await prisma.portfolio.groupBy({
      by: ['status'],
      _count: true,
    });

    // Format data for charts
    const formattedData = {
      viewsByCategory: viewsByCategory.map(item => ({
        name: item.category,
        views: item._sum.views || 0,
      })),
      projectsByCategory: projectsByCategory.map(item => ({
        name: item.category,
        value: item._count,
      })),
      projectsByStatus: projectsByStatus.map(item => ({
        name: item.status,
        value: item._count,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch portfolio analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio analytics' },
      { status: 500 }
    );
  }
} 