import express from 'express';
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
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
