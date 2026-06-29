import { Request, Response } from 'express';
import { logger } from '@autogravity/shared';

export class HealthController {
  public health = (req: Request, res: Response): void => {
    logger.info('Health check requested');
    res.status(200).json({ status: 'OK', timestamp: new Date() });
  };

  public ready = (req: Request, res: Response): void => {
    // Add DB/Redis connection checks here later
    res.status(200).json({ status: 'Ready' });
  };

  public version = (req: Request, res: Response): void => {
    res.status(200).json({ version: '1.0.0' });
  };

  public metrics = (req: Request, res: Response): void => {
    // Placeholder for Prometheus/system metrics
    res.status(200).json({ memory: process.memoryUsage() });
  };
}
