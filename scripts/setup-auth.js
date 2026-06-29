const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/api/src');

// Auth Service
fs.writeFileSync(path.join(srcDir, 'services', 'auth.service.ts'), `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
// import { prisma } from '../config/prisma'; // Assumes Prisma setup

export class AuthService {
  public async generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    // Save to DB
    // await prisma.session.create({ data: { userId, refreshToken, expiresAt: new Date(Date.now() + 7*24*60*60*1000) }});
    
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
`);

// Auth Middleware
fs.writeFileSync(path.join(srcDir, 'middleware', 'auth.middleware.ts'), `import { Request, Response, NextFunction } from 'express';
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
`);

// BullMQ Queue Service
fs.writeFileSync(path.join(srcDir, 'services', 'queue.service.ts'), `import { Queue, Worker, QueueEvents } from 'bullmq';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';

const connection = {
  url: env.REDIS_URL || 'redis://127.0.0.1:6379'
};

export class QueueService {
  private uploadQueue: Queue;
  
  constructor() {
    this.uploadQueue = new Queue('upload-queue', { connection });
    logger.info('QueueService initialized');
  }

  public async addUploadJob(videoId: string, data: any) {
    const job = await this.uploadQueue.add('upload', { videoId, ...data });
    logger.info(\`Added job \${job.id} to upload queue\`);
    return job;
  }
}
`);

// Auth Controller
fs.writeFileSync(path.join(srcDir, 'controllers', 'auth.controller.ts'), `import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<void> => {
    // Placeholder login - would validate against DB User
    const { email, password } = req.body;
    
    if (email === 'admin@autogravity.ai' && password === 'admin') {
      const tokens = await this.authService.generateTokens('1', 'ADMIN');
      res.status(200).json(tokens);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };
}
`);

// Auth Routes
fs.writeFileSync(path.join(srcDir, 'routes', 'auth.routes.ts'), `import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to get tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

export default router;
`);

// Update server.ts
const serverPath = path.join(srcDir, 'server.ts');
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(
  "import healthRoutes from './routes/health.routes';",
  "import healthRoutes from './routes/health.routes';\nimport authRoutes from './routes/auth.routes';"
);
serverContent = serverContent.replace(
  "app.use('/', healthRoutes);",
  "app.use('/', healthRoutes);\napp.use('/auth', authRoutes);"
);
fs.writeFileSync(serverPath, serverContent);

console.log("Auth and Queue logic generated.");
