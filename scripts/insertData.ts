import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  portfolioData,
  blogPosts,
  resumeData,
  testimonialData,
  clientData,
  serviceData,
  pricingData,
} from '../src/data/content';
import {
  insertPortfolios,
  insertBlogPosts,
  insertResume,
  insertTestimonials,
  insertClients,
  insertServices,
  insertPricingPlans,
  insertSettings,
} from '../src/lib/db';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Professional content writer with 10+ years of experience',
        profession: ['Content Writer', 'SEO Marketer', 'Writing Book'],
        socialLinks: {
          facebook: 'https://facebook.com/johnsmith',
          twitter: 'https://twitter.com/johnsmith',
          linkedin: 'https://linkedin.com/in/johnsmith',
        },
      },
    });

    // Insert all data
    const portfolios = await insertPortfolios(portfolioData, admin.id);
    const posts = await insertBlogPosts(blogPosts, admin.id);
    const resume = await insertResume(resumeData);
    const testimonials = await insertTestimonials(testimonialData, admin.id);
    const clients = await insertClients(clientData);
    const services = await insertServices(serviceData);
    const pricingPlans = await insertPricingPlans(pricingData);

    const settings = await insertSettings({
      siteName: 'John Smith - Professional Content Writer',
      siteDescription: 'Expert content writing services for your business',
      metaKeywords: 'content writing, SEO, digital marketing, copywriting',
      metaDescription: 'Professional content writing services by John Smith',
      googleAnalytics: 'UA-XXXXXXXXX-X',
    });

    console.log('Data inserted successfully:', {
      admin,
      portfolios,
      posts,
      resume,
      testimonials,
      clients,
      services,
      pricingPlans,
      settings,
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 