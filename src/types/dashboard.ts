export interface DashboardStats {
  totalViews: number;
  totalPosts: number;
  newPosts: number;
  engagementRate: number;
  totalSubscribers: number;
}

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  stats: DashboardStats;
  charts: {
    dailyViews: any[];
    devices: any[];
    browsers: any[];
    countries: any[];
  };
  popularPosts: any[];
  recentActivities: any[];
} 