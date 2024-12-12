import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Branding',
  'Content Writing',
  'Digital Marketing',
  'Photography',
  'Video Production',
  'Illustration',
  'Other'
];

export async function GET() {
  try {
    // Get unique categories from the database
    const dbCategories = await prisma.portfolio.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    // Combine database categories with default categories
    const categories = Array.from(new Set([
      ...DEFAULT_CATEGORIES,
      ...dbCategories.map(item => item.category).filter(Boolean)
    ]));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return default categories if database query fails
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
} 