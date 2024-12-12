import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Parser } from 'json2csv';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    const portfolios = await prisma.portfolio.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    const fields = [
      'title',
      'category',
      'description',
      'client',
      'date',
      'views',
      'likes',
      'services',
      'author.name',
      'createdAt',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(portfolios);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=portfolio-export.csv',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
} 