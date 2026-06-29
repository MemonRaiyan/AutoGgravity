import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/', authenticate, analyticsController.getAnalytics);

export default router;
