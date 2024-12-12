import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // If no testimonials exist, create sample data
    if (testimonials.length === 0 && session?.user?.id) {
      const sampleTestimonials = [
        {
          name: "John Smith",
          position: "CEO",
          company: "Tech Solutions",
          image: "https://res.cloudinary.com/dovrz0lef/image/upload/v1/samples/people/smiling-man",
          cloudinaryId: "samples/people/smiling-man",
          rating: 5,
          review: "Excellent work on our website redesign project. The attention to detail was impressive.",
          projectType: "Website Redesign",
          date: "Jan 2024 - Mar 2024",
          authorId: session.user.id,
        },
        {
          name: "Sarah Johnson",
          position: "Marketing Director",
          company: "Digital Innovations",
          image: "https://res.cloudinary.com/dovrz0lef/image/upload/v1/samples/people/kitchen-bar",
          cloudinaryId: "samples/people/kitchen-bar",
          rating: 5,
          review: "Outstanding development work. The final product exceeded our expectations.",
          projectType: "Mobile App Development",
          date: "Feb 2024 - Apr 2024",
          authorId: session.user.id,
        },
      ];

      await prisma.testimonial.createMany({
        data: sampleTestimonials,
      });

      return NextResponse.json(sampleTestimonials);
    }

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        position: data.position,
        company: data.company,
        image: data.image,
        cloudinaryId: data.cloudinaryId,
        rating: parseInt(data.rating),
        review: data.review,
        projectType: data.projectType,
        date: data.date,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
} 