import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const [posts, users, portfolios] = await Promise.all([
      // Search posts
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          excerpt: true,
        },
      }),

      // Search users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      }),

      // Search portfolios
      prisma.portfolio.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
        },
      }),
    ]);

    const results = [
      ...posts.map(post => ({
        ...post,
        type: 'post',
        description: post.excerpt,
      })),
      ...users.map(user => ({
        ...user,
        type: 'user',
        title: user.name,
        description: `${user.role} • ${user.email}`,
      })),
      ...portfolios.map(portfolio => ({
        ...portfolio,
        type: 'portfolio',
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
} 