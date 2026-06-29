import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const settingsController = new SettingsController();

router.get('/', authenticate, settingsController.getSettings);
router.get('/ai', authenticate, settingsController.getAISettings);

export default router;
