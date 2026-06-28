const fs = require('fs');
const path = require('path');

const apiSrc = path.join(__dirname, '../apps/api/src');

// API boilerplate
const apiFiles = {
  'server.ts': `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1', routes);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/version', (req, res) => res.json({ version: '1.0.0' }));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(\`API server running on port \${PORT}\`));
`,
  'routes/index.ts': `import { Router } from 'express';
import authRoutes from './auth';

const router = Router();
router.use('/auth', authRoutes);
export default router;
`,
  'routes/auth.ts': `import { Router } from 'express';
const router = Router();
router.post('/login', (req, res) => res.json({ token: 'stub-token' }));
export default router;
`,
  'middleware/errorHandler.ts': `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};
`,
  'middleware/logger.ts': `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(\`\${req.method} \${req.url}\`);
  next();
};
`,
  'utils/logger.ts': `import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
`
};

for (const [file, content] of Object.entries(apiFiles)) {
  const fullPath = path.join(apiSrc, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log('API boilerplate generated.');

const dashboardApp = path.join(__dirname, '../apps/dashboard/app');
const pages = ['dashboard', 'uploads', 'queue', 'analytics', 'channels', 'ai', 'scheduler', 'logs', 'settings', 'login'];

for (const page of pages) {
  const dir = path.join(dashboardApp, page);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), `export default function \${page.charAt(0).toUpperCase() + page.slice(1)}Page() {
  return <div className="p-8"><h1 className="text-2xl font-bold capitalize">\${page}</h1></div>;
}`);
}

console.log('Dashboard pages generated.');
