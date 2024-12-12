import prisma from '@/lib/prisma';

export const analyticsService = {
  async getDashboardStats(dateRange: string) {
    const now = new Date();
    const startDate = new Date();

    // Set date range
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        startDate.setDate(now.getDate() - 365);
        break;
    }

    // Get total views
    const totalViews = await prisma.post.aggregate({
      _sum: { views: true }
    });

    // Get total posts
    const totalPosts = await prisma.post.count();

    // Get new posts in date range
    const newPosts = await prisma.post.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Get popular posts
    const popularPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    });

    // Get recent activities
    const recentActivities = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, image: true }
        }
      }
    });

    // Get visitor analytics
    const analytics = await prisma.analytics.findMany({
      where: {
        timestamp: { gte: startDate }
      }
    });

    // Process analytics data
    const deviceStats = analytics.reduce((acc: any, curr) => {
      acc[curr.device] = (acc[curr.device] || 0) + 1;
      return acc;
    }, {});

    const browserStats = analytics.reduce((acc: any, curr) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1;
      return acc;
    }, {});

    const countryStats = analytics.reduce((acc: any, curr) => {
      acc[curr.country] = (acc[curr.country] || 0) + 1;
      return acc;
    }, {});

    // Get daily views
    const dailyViews = await prisma.pageView.groupBy({
      by: ['createdAt'],
      _sum: { views: true },
      where: {
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Get user data from session
    const user = await prisma.user.findFirst({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });

    try {
      return {
        user,
        stats: {
          totalViews: totalViews._sum.views || 0,
          totalPosts,
          newPosts,
          engagementRate: ((totalViews._sum.views || 0) / totalPosts).toFixed(2),
          totalSubscribers: 0
        },
        charts: {
          dailyViews: dailyViews || [],
          devices: [],
          browsers: [],
          countries: []
        },
        popularPosts: popularPosts || [],
        recentActivities: recentActivities || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        stats: {
          totalViews: 0,
          totalPosts: 0,
          newPosts: 0,
          engagementRate: '0',
          totalSubscribers: 0
        },
        charts: {
          dailyViews: [],
          devices: [],
          browsers: [],
          countries: []
        },
        popularPosts: [],
        recentActivities: []
      };
    }
  },

  async getRealtimeAnalytics() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const realtimeVisitors = await prisma.analytics.findMany({
      where: {
        timestamp: { gte: thirtyMinutesAgo }
      },
      orderBy: { timestamp: 'desc' }
    });

    const pageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: thirtyMinutesAgo }
      },
      include: {
        post: {
          select: { title: true }
        }
      }
    });

    return {
      activeVisitors: realtimeVisitors.length,
      recentVisitors: realtimeVisitors.map(visitor => ({
        id: visitor.id,
        page: visitor.pageUrl,
        browser: visitor.browser,
        device: visitor.device,
        country: visitor.country,
        timestamp: visitor.timestamp
      })),
      pageViews: pageViews.map(view => ({
        url: view.url,
        title: view.post?.title || view.url,
        views: view.views,
        uniqueViews: view.uniqueViews
      }))
    };
  },

  async trackPageView(postId: string, url: string) {
    const existingView = await prisma.pageView.findFirst({
      where: { url }
    });

    if (existingView) {
      return prisma.pageView.update({
        where: { id: existingView.id },
        data: {
          views: { increment: 1 }
        }
      });
    }

    return prisma.pageView.create({
      data: {
        postId,
        url,
        views: 1,
        uniqueViews: 1
      }
    });
  }
}; 