import { Router } from 'express';
import { VideoController } from '../controllers/video.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const videoController = new VideoController();

router.get('/', authenticate, videoController.getVideos);

export default router;
