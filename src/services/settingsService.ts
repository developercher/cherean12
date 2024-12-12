import prisma from '@/lib/prisma';
import { cache } from 'react';

export const settingsService = {
  // Cache the settings for 5 minutes
  getSettings: cache(async () => {
    const settings = await prisma.settings.findFirst();
    return settings;
  }),

  async updateSettings(data: any) {
    return prisma.settings.upsert({
      where: { id: data.id || 'default' },
      update: data,
      create: data,
    });
  },

  async updateTheme(theme: string, userId: string) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        theme,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  },

  async toggleMaintenanceMode(enabled: boolean, userId: string) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        maintenanceMode: enabled,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  },

  async updateEmailSettings(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword,
        emailFrom: data.emailFrom,
        emailTemplate: data.emailTemplate,
      },
    });
  },

  async updateSecurity(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        enableTwoFactor: data.enableTwoFactor,
        passwordPolicy: data.passwordPolicy,
        sessionTimeout: data.sessionTimeout,
        maxLoginAttempts: data.maxLoginAttempts,
      },
    });
  },

  async updateSocialLinks(links: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        socialLinks: links,
      },
    });
  },

  async updateAnalytics(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        googleAnalyticsId: data.googleAnalyticsId,
        facebookPixelId: data.facebookPixelId,
      },
    });
  },

  async updateBackupSettings(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        autoBackup: data.autoBackup,
        backupFrequency: data.backupFrequency,
        backupRetention: data.backupRetention,
      },
    });
  },

  async updateApiSettings(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        enableApi: data.enableApi,
        apiKey: data.apiKey,
        allowedOrigins: data.allowedOrigins,
      },
    });
  },

  async updateNotificationSettings(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        notificationTypes: data.notificationTypes,
        pushEnabled: data.pushEnabled,
        vapidPublicKey: data.vapidPublicKey,
        vapidPrivateKey: data.vapidPrivateKey,
      },
    });
  },

  async updateCustomCode(data: any) {
    return prisma.settings.update({
      where: { id: 'default' },
      data: {
        customCss: data.customCss,
        customJs: data.customJs,
        headerScripts: data.headerScripts,
        footerScripts: data.footerScripts,
      },
    });
  },

  async testEmailSettings(data: any) {
    // Implement email testing logic
  },

  async backupDatabase() {
    // Implement database backup logic
  },

  async restoreDatabase(backupId: string) {
    // Implement database restore logic
  },

  async generateApiKey() {
    // Generate and update API key
  },

  async clearCache() {
    // Clear application cache
  },

  async exportSettings() {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  },

  async importSettings(data: string) {
    const settings = JSON.parse(data);
    return this.updateSettings(settings);
  },
}; 