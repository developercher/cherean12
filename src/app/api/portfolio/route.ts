import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Failed to fetch portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        authorId: data.authorId,
        date: new Date(data.date),
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Failed to create portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 