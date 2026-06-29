
import { Worker, Job } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';
import { YouTubeService } from '../services/youtube.service';
import { FacebookService } from '../services/facebook.service';
import { InstagramService } from '../services/instagram.service';

const connection = { url: env.REDIS_URL || 'redis://127.0.0.1:6379' };

export const uploadWorker = new Worker('upload-queue', async (job: Job) => {
  logger.info(`Processing upload job ${job.id} for video ${job.data.videoId}`);
  const { videoId, platform, filePath, metadata, tokens } = job.data;

  try {
    let url = '';
    if (platform === 'YOUTUBE') {
      const yt = new YouTubeService();
      url = await yt.uploadVideo(filePath, metadata, tokens);
    } else if (platform === 'META_FB') {
      const fb = new FacebookService();
      url = await fb.uploadVideo(filePath, metadata, tokens);
    } else if (platform === 'META_IG') {
      const ig = new InstagramService();
      url = await ig.uploadVideo(filePath, metadata, tokens);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // await prisma.uploadHistory.create({ ... })
    logger.info(`Upload complete: ${url}`);
    return { url };
  } catch (error: any) {
    logger.error(`Upload failed: ${error.message}`);
    throw error;
  }
}, { connection, concurrency: 5 });

uploadWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});
