import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', healthController.health);

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Readiness probe
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Ready
 */
router.get('/ready', healthController.ready);

/**
 * @swagger
 * /version:
 *   get:
 *     summary: API version
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Version info
 */
router.get('/version', healthController.version);

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: System metrics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Metrics data
 */
router.get('/metrics', healthController.metrics);

export default router;
