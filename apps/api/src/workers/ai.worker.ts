
import { Worker, Job } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';
import { AIService } from '../services/ai.service';
import { QueueService } from '../services/queue.service';

const connection = { url: env.REDIS_URL || 'redis://127.0.0.1:6379' };

export const aiWorker = new Worker('ai-queue', async (job: Job) => {
  logger.info(`Processing AI job ${job.id}`);
  const { videoId, fileName, platform, filePath, tokens } = job.data;

  const aiService = new AIService();
  try {
    const metadata = await aiService.generateMetadata(fileName);
    logger.info(`Generated AI metadata for ${videoId}`);

    // Add to upload queue
    const queueService = new QueueService();
    await queueService.addUploadJob(videoId, { platform, filePath, metadata, tokens });

    return { metadata };
  } catch (error: any) {
    logger.error(`AI generation failed: ${error.message}`);
    throw error;
  }
}, { connection, concurrency: 5 });
