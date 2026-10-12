import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from server/.env then fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const requiredVars = ['MONGODB_URI', 'SESSION_SECRET'];

for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`ERROR: Missing required environment variable: ${v}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap',
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  demoMode: process.env.DEMO_MODE === 'true',
  demoStudentPassword: process.env.DEMO_STUDENT_PASSWORD || 'DemoStudent123!',
  demoRecruiterPassword: process.env.DEMO_RECRUITER_PASSWORD || 'DemoRecruiter123!',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  geminiMaxTokens: parseInt(process.env.GEMINI_MAX_TOKENS, 10) || 2048,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || (process.env.NODE_ENV === 'development' ? 10000 : 200)
  },
  rateLimitAuth: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || (process.env.NODE_ENV === 'development' ? 2000 : 50)
  }
};

export default config;
