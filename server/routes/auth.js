import { Router } from 'express';
import { register, login, logout, getCurrentUser, demoLogin } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: config.rateLimitAuth.windowMs,
  max: config.rateLimitAuth.max,
  message: { error: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/demo-login', demoLogin);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

export default router;
