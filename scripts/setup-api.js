const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/api/src');

const dirs = [
  'controllers', 'services', 'repositories', 'middleware', 
  'validators', 'routes', 'workers', 'utils', 'config'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
});

// Swagger
fs.writeFileSync(path.join(srcDir, 'config', 'swagger.ts'), `import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoGravity API',
      version: '1.0.0',
      description: 'API documentation for AutoGravity Platform',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
`);

// Health Routes
fs.writeFileSync(path.join(srcDir, 'routes', 'health.routes.ts'), `import { Router } from 'express';
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
`);

// Health Controller
fs.writeFileSync(path.join(srcDir, 'controllers', 'health.controller.ts'), `import { Request, Response } from 'express';
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
`);

// Server.ts
fs.writeFileSync(path.join(srcDir, 'server.ts'), `import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
import { swaggerSpec } from './config/swagger';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', healthRoutes);

app.listen(env.PORT, () => {
  logger.info(\`Server is running on http://localhost:\${env.PORT}\`);
  logger.info(\`Swagger docs available at http://localhost:\${env.PORT}/api-docs\`);
});
`);

console.log("API setup complete.");
