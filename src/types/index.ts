export interface Portfolio {
  title: string;
  category: string;
  description: string;
  image: string;
  client?: string;
  date: Date;
  services: string[];
  budget?: string;
  likes?: number;
  views?: number;
  strategy?: string;
  design?: string;
  userExperience?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  category: string;
  readTime: string;
  status: 'draft' | 'published';
  tags: string[];
}

export interface Resume {
  type: 'education' | 'experience' | 'skills';
  title: string;
  organization: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  grade?: string;
  description?: string;
  skills?: Record<string, number>;
}

export interface Testimonial {
  name: string;
  position: string;
  company: string;
  image?: string;
  rating: number;
  review: string;
  projectType: string;
  date: string;
}

export interface Client {
  name: string;
  logo: string;
  category: string;
  link?: string;
}

export interface Service {
  title: string;
  icon: string;
  description: string;
  features: string[];
}

export interface PricingPlan {
  name: string;
  price: number;
  currency?: string;
  duration?: string;
  description: string;
  features: string[];
  deliveryTime: string;
  revisions: string;
} 