import prisma from '@/lib/prisma';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const backupService = {
  async createBackup() {
    try {
      // Get all data from each model
      const [
        users,
        posts,
        portfolios,
        testimonials,
        clients,
        services,
        settings,
        analytics
      ] = await Promise.all([
        prisma.user.findMany(),
        prisma.post.findMany(),
        prisma.portfolio.findMany(),
        prisma.testimonial.findMany(),
        prisma.client.findMany(),
        prisma.service.findMany(),
        prisma.settings.findMany(),
        prisma.analytics.findMany({
          take: 1000, // Limit analytics data
          orderBy: { timestamp: 'desc' }
        })
      ]);

      // Create backup object
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          users,
          posts,
          portfolios,
          testimonials,
          clients,
          services,
          settings,
          analytics
        }
      };

      // Generate backup filename
      const filename = `backup-${new Date().toISOString()}.json`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `backups/${filename}`,
        Body: JSON.stringify(backup, null, 2),
        ContentType: 'application/json',
      });

      await s3Client.send(uploadCommand);

      // Create backup record
      await prisma.backup.create({
        data: {
          filename,
          size: JSON.stringify(backup).length,
          type: 'full',
          status: 'completed',
        }
      });

      return { success: true, filename };
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  },

  async restoreBackup(filename: string) {
    try {
      // Get backup file from S3
      const getCommand = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `backups/${filename}`
      });

      const response = await s3Client.send(getCommand);
      const backupData = JSON.parse(await response.Body!.transformToString());

      // Begin transaction
      await prisma.$transaction(async (tx) => {
        // Clear existing data
        await Promise.all([
          tx.post.deleteMany(),
          tx.portfolio.deleteMany(),
          tx.testimonial.deleteMany(),
          tx.client.deleteMany(),
          tx.service.deleteMany(),
          tx.settings.deleteMany(),
        ]);

        // Restore data
        await Promise.all([
          tx.post.createMany({ data: backupData.data.posts }),
          tx.portfolio.createMany({ data: backupData.data.portfolios }),
          tx.testimonial.createMany({ data: backupData.data.testimonials }),
          tx.client.createMany({ data: backupData.data.clients }),
          tx.service.createMany({ data: backupData.data.services }),
          tx.settings.createMany({ data: backupData.data.settings }),
        ]);
      });

      return { success: true };
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  },

  async listBackups() {
    return prisma.backup.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getBackupDownloadUrl(filename: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `backups/${filename}`
    });

    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  },

  async scheduleBackup() {
    // Create a scheduled backup record
    const backup = await prisma.backup.create({
      data: {
        filename: `scheduled-${new Date().toISOString()}.json`,
        type: 'scheduled',
        status: 'pending',
      }
    });

    // Trigger backup process
    await this.createBackup();

    return backup;
  },

  async cleanupOldBackups(retentionDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const oldBackups = await prisma.backup.findMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    // Delete from S3 and database
    await Promise.all(oldBackups.map(async (backup) => {
      try {
        // Delete from S3
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `backups/${backup.filename}`
        }));

        // Delete from database
        await prisma.backup.delete({
          where: { id: backup.id }
        });
      } catch (error) {
        console.error(`Failed to delete backup ${backup.filename}:`, error);
      }
    }));
  }
}; 