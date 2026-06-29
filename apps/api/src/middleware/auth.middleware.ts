import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '@autogravity/shared';

const authService = new AuthService();

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = authService.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt');
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};
