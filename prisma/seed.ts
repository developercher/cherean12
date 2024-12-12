import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // At the start of your seed function
  await prisma.post.deleteMany({});

  // Create admin user with specific credentials
  const hashedPassword = await bcrypt.hash('cherean', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'cherinet@gmail.com' },
    update: {},
    create: {
      name: 'Cherinet',
      email: 'cherinet@gmail.com',
      password: hashedPassword,
      role: 'admin',
      profession: ['Admin'],
      socialLinks: {},
    },
  });

  console.log({ admin });

  // Verify the admin user is created with correct role
  const adminUser = await prisma.user.findUnique({
    where: { email: 'cherinet@gmail.com' },
  });

  console.log('Admin user:', admin);

  // Create portfolio items
  const portfolios = await Promise.all([
    prisma.portfolio.create({
      data: {
        title: 'Content Strategy for Tech Startup',
        category: 'Content Strategy',
        description: 'Developed comprehensive content strategy increasing user engagement by 150%',
        image: 'https://example.com/portfolio1.jpg',
        client: 'TechStart Inc.',
        date: new Date('2024-01-15'),
        services: ['Content Strategy', 'SEO Optimization'],
        budget: '$5,000',
        likes: 45,
        views: 1200,
        strategy: 'User-focused content with SEO optimization',
        authorId: admin.id,
      },
    }),
    prisma.portfolio.create({
      data: {
        title: 'E-commerce Product Descriptions',
        category: 'Copywriting',
        description: 'Created compelling product descriptions for 200+ products',
        image: 'https://example.com/portfolio2.jpg',
        client: 'Fashion Retail Co.',
        date: new Date('2024-02-20'),
        services: ['Copywriting', 'Product Description'],
        budget: '$3,000',
        likes: 32,
        views: 850,
        authorId: admin.id,
      },
    }),
  ]);

  // Create blog posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'The Art of Content Writing',
        slug: `unique-post-slug-${Date.now()}`,
        content: 'Detailed article about content writing best practices...',
        excerpt: 'Learn the fundamentals of effective content writing',
        coverImage: 'https://example.com/blog1.jpg',
        category: 'Writing Tips',
        readTime: '5 min read',
        status: 'published',
        tags: ['Content Writing', 'SEO', 'Digital Marketing'],
        authorId: admin.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'SEO Optimization Guide 2024',
        slug: 'seo-optimization-guide-2024',
        content: 'Comprehensive guide to SEO optimization...',
        excerpt: 'Master SEO techniques for better content visibility',
        coverImage: 'https://example.com/blog2.jpg',
        category: 'SEO',
        readTime: '8 min read',
        status: 'published',
        tags: ['SEO', 'Digital Marketing', 'Content Strategy'],
        authorId: admin.id,
      },
    }),
  ]);

  // Create resume entries
  const resumeEntries = await Promise.all([
    prisma.resume.create({
      data: {
        type: 'education',
        title: 'Master in Creative Writing',
        organization: 'University of Arts',
        location: 'New York',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2017-06-30'),
        grade: '3.90/4.00',
        description: 'Specialized in digital content creation and storytelling',
      },
    }),
    prisma.resume.create({
      data: {
        type: 'experience',
        title: 'Senior Content Writer',
        organization: 'Digital Marketing Agency',
        location: 'San Francisco',
        startDate: new Date('2017-07-01'),
        current: true,
        description: 'Leading content strategy for major tech clients',
      },
    }),
    prisma.resume.create({
      data: {
        type: 'skills',
        title: 'Technical Skills',
        organization: 'Professional Skills',
        skills: {
          'Content Writing': 95,
          'SEO Optimization': 90,
          'Content Strategy': 85,
          'Social Media Marketing': 80,
        },
        startDate: new Date(),
      },
    }),
  ]);

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Sarah Johnson',
        position: 'Marketing Director',
        company: 'Tech Solutions Inc.',
        image: 'https://example.com/testimonial1.jpg',
        rating: 5,
        review: 'Exceptional content that drove our engagement metrics through the roof!',
        projectType: 'Content Strategy',
        date: 'Jan 2024 - Mar 2024',
        authorId: admin.id,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Michael Chen',
        position: 'CEO',
        company: 'StartUp Hub',
        image: 'https://example.com/testimonial2.jpg',
        rating: 5,
        review: 'Outstanding work on our product descriptions and marketing content.',
        projectType: 'Copywriting',
        date: 'Feb 2024 - Apr 2024',
        authorId: admin.id,
      },
    }),
  ]);

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Tech Solutions Inc.',
        logo: 'https://example.com/client1.jpg',
        category: 'Technology',
        link: 'https://techsolutions.com',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Fashion Retail Co.',
        logo: 'https://example.com/client2.jpg',
        category: 'E-commerce',
        link: 'https://fashionretail.com',
      },
    }),
  ]);

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: 'Content Writing',
        icon: 'pencil-square',
        description: 'Professional content writing services for your business',
        features: [
          'SEO-optimized content',
          'Engaging storytelling',
          'Brand voice consistency',
          'Research-based writing',
        ],
      },
    }),
    prisma.service.create({
      data: {
        title: 'Content Strategy',
        icon: 'chart-bar',
        description: 'Strategic content planning and development',
        features: [
          'Content audit',
          'Competitor analysis',
          'Content calendar',
          'Performance tracking',
        ],
      },
    }),
  ]);

  // Create pricing plans
  const pricingPlans = await Promise.all([
    prisma.pricingPlan.create({
      data: {
        name: 'Basic',
        price: 99.99,
        description: 'Perfect for small businesses',
        features: [
          '5 Blog Posts',
          'Basic SEO',
          'Social Media Copy',
          '2 Revisions',
        ],
        deliveryTime: '3 Days Delivery',
        revisions: '2 Revisions',
      },
    }),
    prisma.pricingPlan.create({
      data: {
        name: 'Premium',
        price: 199.99,
        description: 'Best for growing companies',
        features: [
          '10 Blog Posts',
          'Advanced SEO',
          'Social Media Strategy',
          'Unlimited Revisions',
        ],
        deliveryTime: '5 Days Delivery',
        revisions: 'Unlimited Revisions',
      },
    }),
  ]);

  // Create settings
  const settings = await prisma.settings.create({
    data: {
      siteName: 'John Smith - Professional Content Writer',
      siteDescription: 'Expert content writing services for your business',
      metaKeywords: 'content writing, SEO, digital marketing, copywriting',
      metaDescription: 'Professional content writing services by John Smith',
      googleAnalytics: 'UA-XXXXXXXXX-X',
    },
  });

  // Add this to your existing seed.ts
  const analytics = await prisma.analytics.createMany({
    data: [
      {
        pageUrl: '/blog/first-post',
        userAgent: 'Mozilla/5.0',
        browser: 'Chrome',
        device: 'Desktop',
        os: 'Windows',
        country: 'United States',
        city: 'New York',
        ip: '127.0.0.1',
      },
      // Add more test data...
    ],
  });

  const pageViews = await prisma.pageView.createMany({
    data: [
      {
        url: '/blog/first-post',
        views: 100,
        uniqueViews: 80,
      },
      // Add more test data...
    ],
  });

  console.log({
    admin,
    portfolios,
    posts,
    resumeEntries,
    testimonials,
    clients,
    services,
    pricingPlans,
    settings,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 