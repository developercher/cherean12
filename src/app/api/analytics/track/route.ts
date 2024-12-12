import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.pageUrl || !data.userAgent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create analytics entry
    const analytics = await prisma.analytics.create({
      data: {
        pageUrl: data.pageUrl,
        userAgent: data.userAgent,
        browser: data.browser || 'Unknown',
        device: data.device || 'Unknown',
        os: data.os || 'Unknown',
        country: data.country || 'Unknown',
        city: data.city || null,
        ip: data.ip || 'Unknown',
      },
    });

    // Track page view
    if (data.pageUrl.startsWith('/blog/')) {
      const postSlug = data.pageUrl.split('/').pop();
      
      if (postSlug) {
        const post = await prisma.post.findFirst({
          where: { slug: postSlug }
        });

        if (post) {
          await prisma.pageView.upsert({
            where: {
              url: data.pageUrl,
            },
            update: {
              views: { increment: 1 }
            },
            create: {
              postId: post.id,
              url: data.pageUrl,
              views: 1,
              uniqueViews: 1
            }
          });

          await prisma.post.update({
            where: { id: post.id },
            data: {
              views: { increment: 1 }
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
} 