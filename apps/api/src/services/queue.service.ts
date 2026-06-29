import { Queue, Worker, QueueEvents } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';

const connection = {
  url: env.REDIS_URL || 'redis://127.0.0.1:6379'
};

export class QueueService {
  private uploadQueue: Queue;
  
  constructor() {
    this.uploadQueue = new Queue('upload-queue', { connection });
    logger.info('QueueService initialized');
  }

  public async addUploadJob(videoId: string, data: any) {
    const job = await this.uploadQueue.add('upload', { videoId, ...data });
    logger.info(`Added job ${job.id} to upload queue`);
    return job;
  }
}
