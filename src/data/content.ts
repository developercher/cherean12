import { 
  Portfolio, BlogPost, Resume, Testimonial, 
  Client, Service, PricingPlan 
} from '@/types';

export const portfolioData: Portfolio[] = [
  {
    title: 'Content Strategy for Tech Startup',
    category: 'Content Strategy',
    description: 'Developed comprehensive content strategy increasing user engagement by 150%',
    image: '/images/portfolio/tech-startup.jpg',
    client: 'TechStart Inc.',
    date: new Date('2024-01-15'),
    services: ['Content Strategy', 'SEO Optimization'],
    budget: '$5,000',
    likes: 45,
    views: 1200,
    strategy: 'User-focused content with SEO optimization',
  },
  // Add more portfolio items...
];

export const blogPosts: BlogPost[] = [
  {
    title: 'The Art of Content Writing',
    slug: 'the-art-of-content-writing',
    content: `# The Art of Content Writing

    Content writing is more than just putting words on a page...
    
    ## Key Elements of Great Content
    1. Clear Value Proposition
    2. Engaging Introduction
    3. Well-Structured Body
    4. Compelling Conclusion
    
    ## Tips for Better Writing
    - Know Your Audience
    - Research Thoroughly
    - Use Simple Language
    - Include Examples
    `,
    excerpt: 'Learn the fundamentals of effective content writing',
    coverImage: '/images/blog/content-writing.jpg',
    category: 'Writing Tips',
    readTime: '5 min read',
    status: 'published',
    tags: ['Content Writing', 'SEO', 'Digital Marketing'],
  },
  // Add more blog posts...
];

export const resumeData: Resume[] = [
  {
    type: 'education',
    title: 'Master in Creative Writing',
    organization: 'University of Arts',
    location: 'New York',
    startDate: new Date('2015-09-01'),
    endDate: new Date('2017-06-30'),
    grade: '3.90/4.00',
    description: 'Specialized in digital content creation and storytelling',
  },
  // Add more resume entries...
];

export const testimonialData: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    position: 'Marketing Director',
    company: 'Tech Solutions Inc.',
    image: '/images/testimonials/sarah.jpg',
    rating: 5,
    review: 'Exceptional content that drove our engagement metrics through the roof!',
    projectType: 'Content Strategy',
    date: 'Jan 2024 - Mar 2024',
  },
  // Add more testimonials...
];

export const clientData: Client[] = [
  {
    name: 'Tech Solutions Inc.',
    logo: '/images/clients/techsolutions.png',
    category: 'Technology',
    link: 'https://techsolutions.com',
  },
  // Add more clients...
];

export const serviceData: Service[] = [
  {
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
  // Add more services...
];

export const pricingData: PricingPlan[] = [
  {
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
  // Add more pricing plans...
]; 