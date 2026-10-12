import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import config from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { attachUser } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import recruiterRoutes from './routes/recruiter.js';
import opportunityRoutes from './routes/opportunities.js';
import applicationRoutes from './routes/applications.js';
import challengeRoutes from './routes/challenges.js';
import projectRoutes from './routes/projects.js';
import savedAndNotifRoutes from './routes/savedAndNotif.js';
import aiRoutes from './routes/ai.js';

const app = express();

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global rate limiting
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
}));

// Session
const sessionConfig = {
  name: 'skillswap.sid',
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

if (config.mongoUri && config.mongoUri !== 'mongodb://localhost:27017/skillswap') {
  sessionConfig.store = MongoStore.create({
    mongoUrl: config.mongoUri,
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
    touchAfter: 24 * 3600
  });
}

app.use(session(sessionConfig));
app.use(attachUser);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable. Please ensure MongoDB is running or check your MONGODB_URI.' });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/recruiter', recruiterRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/user', savedAndNotifRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error handler
app.use(errorHandler);

export default app;
