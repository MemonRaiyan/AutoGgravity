import { Router } from 'express';
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
