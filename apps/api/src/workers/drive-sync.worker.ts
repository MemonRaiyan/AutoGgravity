
import { Worker, Job } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';
import { GoogleDriveService } from '../services/google-drive.service';

const connection = { url: env.REDIS_URL || 'redis://127.0.0.1:6379' };

export const driveSyncWorker = new Worker('drive-sync-queue', async (job: Job) => {
  logger.info('Running Google Drive sync job');
  // For each configured channel with Drive credentials:
  // const drive = new GoogleDriveService(tokens);
  // const files = await drive.pollFolder(folderId);
  // Iterate, download, then add to 'ai-queue'
  logger.info('Drive sync complete');
}, { connection });
