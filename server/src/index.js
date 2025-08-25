import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import vehicleRoutes from './routes/vehicles.routes.js';
import slotRoutes from './routes/slots.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import { errorHandler } from './middleware/error.js';
import { seedAdmin } from './utils/seed.js';

const app = express();

// Security & common middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/payments', paymentRoutes);

// Error handler
app.use(errorHandler);

// Start
(async () => {
  await connectDB();
  await seedAdmin();
  app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));
})();
