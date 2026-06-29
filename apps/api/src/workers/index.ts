
import { logger } from '@autogravity/shared';
import './upload.worker';
import './ai.worker';
import './drive-sync.worker';

logger.info('All BullMQ workers initialized and listening.');
