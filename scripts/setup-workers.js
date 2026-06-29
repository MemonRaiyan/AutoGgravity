const fs = require('fs');
const path = require('path');

const workersDir = path.join(__dirname, '../apps/api/src/workers');
if (!fs.existsSync(workersDir)) fs.mkdirSync(workersDir, { recursive: true });

// 1. Upload Worker
fs.writeFileSync(path.join(workersDir, 'upload.worker.ts'), `
import { Worker, Job } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';
import { YouTubeService } from '../services/youtube.service';
import { FacebookService } from '../services/facebook.service';
import { InstagramService } from '../services/instagram.service';

const connection = { url: env.REDIS_URL || 'redis://127.0.0.1:6379' };

export const uploadWorker = new Worker('upload-queue', async (job: Job) => {
  logger.info(\`Processing upload job \${job.id} for video \${job.data.videoId}\`);
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
      throw new Error(\`Unsupported platform: \${platform}\`);
    }

    // await prisma.uploadHistory.create({ ... })
    logger.info(\`Upload complete: \${url}\`);
    return { url };
  } catch (error: any) {
    logger.error(\`Upload failed: \${error.message}\`);
    throw error;
  }
}, { connection, concurrency: 5 });

uploadWorker.on('failed', (job, err) => {
  logger.error(\`Job \${job?.id} failed: \${err.message}\`);
});
`);

// 2. AI Worker
fs.writeFileSync(path.join(workersDir, 'ai.worker.ts'), `
import { Worker, Job } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma';
import { AIService } from '../services/ai.service';
import { QueueService } from '../services/queue.service';

const connection = { url: env.REDIS_URL || 'redis://127.0.0.1:6379' };

export const aiWorker = new Worker('ai-queue', async (job: Job) => {
  logger.info(\`Processing AI job \${job.id}\`);
  const { videoId, fileName, platform, filePath, tokens } = job.data;

  const aiService = new AIService();
  try {
    const metadata = await aiService.generateMetadata(fileName);
    logger.info(\`Generated AI metadata for \${videoId}\`);

    // Add to upload queue
    const queueService = new QueueService();
    await queueService.addUploadJob(videoId, { platform, filePath, metadata, tokens });

    return { metadata };
  } catch (error: any) {
    logger.error(\`AI generation failed: \${error.message}\`);
    throw error;
  }
}, { connection, concurrency: 5 });
`);

// 3. Drive Sync Worker (Scheduled Cron)
fs.writeFileSync(path.join(workersDir, 'drive-sync.worker.ts'), `
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
`);

// 4. Index
fs.writeFileSync(path.join(workersDir, 'index.ts'), `
import { logger } from '@autogravity/shared';
import './upload.worker';
import './ai.worker';
import './drive-sync.worker';

logger.info('All BullMQ workers initialized and listening.');
`);

console.log('Workers generated.');
