const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/api/src');

// Channels Controller
fs.writeFileSync(path.join(srcDir, 'controllers', 'channel.controller.ts'), `import { Request, Response } from 'express';
// import { prisma } from '../config/prisma';

export class ChannelController {
  public getChannels = async (req: Request, res: Response): Promise<void> => {
    // Mock for MVP without breaking compilation
    res.status(200).json([]);
  };
}
`);

// Channels Routes
fs.writeFileSync(path.join(srcDir, 'routes', 'channel.routes.ts'), `import { Router } from 'express';
import { ChannelController } from '../controllers/channel.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const channelController = new ChannelController();

/**
 * @swagger
 * /channels:
 *   get:
 *     summary: Get all connected channels
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of channels
 */
router.get('/', authenticate, channelController.getChannels);

export default router;
`);

// Queue Controller
fs.writeFileSync(path.join(srcDir, 'controllers', 'queue.controller.ts'), `import { Request, Response } from 'express';
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
`);

// Queue Routes
fs.writeFileSync(path.join(srcDir, 'routes', 'queue.routes.ts'), `import { Router } from 'express';
import { QueueController } from '../controllers/queue.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const queueController = new QueueController();

/**
 * @swagger
 * /queue/metrics:
 *   get:
 *     summary: Get queue metrics from BullMQ
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job counts
 */
router.get('/metrics', authenticate, queueController.getMetrics);

export default router;
`);

// Update server.ts
const serverPath = path.join(srcDir, 'server.ts');
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(
  "import authRoutes from './routes/auth.routes';",
  "import authRoutes from './routes/auth.routes';\nimport channelRoutes from './routes/channel.routes';\nimport queueRoutes from './routes/queue.routes';"
);
serverContent = serverContent.replace(
  "app.use('/auth', authRoutes);",
  "app.use('/auth', authRoutes);\napp.use('/api/channels', channelRoutes);\napp.use('/api/queue', queueRoutes);"
);
fs.writeFileSync(serverPath, serverContent);

console.log("API endpoints added.");
