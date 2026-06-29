import { Request, Response } from 'express';
import { Queue } from 'bullmq';
import { env } from '@autogravity/config';

export class QueueController {
  public getMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const uploadQueue = new Queue('upload-queue', { connection: { url: env.REDIS_URL || 'redis://127.0.0.1:6379' } });
      const counts = await uploadQueue.getJobCounts('waiting', 'active', 'completed', 'failed');
      res.status(200).json(counts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
