import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from '@autogravity/config';
import { logger } from '@autogravity/shared';
import { swaggerSpec } from './config/swagger';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import channelRoutes from './routes/channel.routes';
import queueRoutes from './routes/queue.routes';
import './workers'; // Initialize BullMQ workers

const app = express();

app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/queue', queueRoutes);

app.listen(env.PORT, () => {
  logger.info(`Server is running on http://localhost:${env.PORT}`);
  logger.info(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
});
