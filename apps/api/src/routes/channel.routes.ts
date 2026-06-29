import { Router } from 'express';
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
