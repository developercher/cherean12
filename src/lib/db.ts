import { PrismaClient } from '@prisma/client';
import { 
  Portfolio, BlogPost, Resume, Testimonial, 
  Client, Service, PricingPlan 
} from '@/types';

const prisma = new PrismaClient();

export async function insertPortfolios(portfolios: Portfolio[], authorId: string) {
  return Promise.all(
    portfolios.map(portfolio =>
      prisma.portfolio.create({
        data: {
          ...portfolio,
          authorId,
        },
      })
    )
  );
}

export async function insertBlogPosts(posts: BlogPost[], authorId: string) {
  return Promise.all(
    posts.map(post =>
      prisma.post.create({
        data: {
          ...post,
          authorId,
        },
      })
    )
  );
}

export async function insertResume(entries: Resume[]) {
  return Promise.all(
    entries.map(entry =>
      prisma.resume.create({
        data: entry,
      })
    )
  );
}

export async function insertTestimonials(testimonials: Testimonial[], authorId: string) {
  return Promise.all(
    testimonials.map(testimonial =>
      prisma.testimonial.create({
        data: {
          ...testimonial,
          authorId,
        },
      })
    )
  );
}

export async function insertClients(clients: Client[]) {
  return Promise.all(
    clients.map(client =>
      prisma.client.create({
        data: client,
      })
    )
  );
}

export async function insertServices(services: Service[]) {
  return Promise.all(
    services.map(service =>
      prisma.service.create({
        data: service,
      })
    )
  );
}

export async function insertPricingPlans(plans: PricingPlan[]) {
  return Promise.all(
    plans.map(plan =>
      prisma.pricingPlan.create({
        data: plan,
      })
    )
  );
}

export async function insertSettings(data: any) {
  return prisma.settings.create({
    data,
  });
} 