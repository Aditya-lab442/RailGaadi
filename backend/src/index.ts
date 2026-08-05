import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load environment variables from backend/.env or .env
const envPath = resolve(process.cwd(), 'backend/.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : resolve(process.cwd(), '.env') });

import searchRoutes from './routes/search';
import trainRoutes from './routes/train';
import weatherRoutes from './routes/weather';
import elevationRoutes from './routes/elevation';
import nearbyRoutes from './routes/nearby';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Security & Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'RailGaadi Intelligence API',
    useRealApi: process.env.USE_REAL_API === 'true',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/train', trainRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/elevation', elevationRoutes);
app.use('/api/nearby', nearbyRoutes);

// Central Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚂 RailGaadi Backend Server running at http://localhost:${PORT}`);
  console.log(`🔑 Live APIs: OpenWeatherMap, OpenTopography, RailRadaar, MapTiler configured!`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use. Run 'npx kill-port 3001' or restart dev server.`);
    process.exit(1);
  }
});
