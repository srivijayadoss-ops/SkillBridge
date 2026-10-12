import { Router } from 'express';
import { isAuthenticated, authorize } from '../middleware/auth.js';
import * as cc from '../controllers/challengeController.js';

const router = Router();

router.get('/', cc.getChallenges);
router.get('/:id', cc.getChallenge);
router.post('/attempt', isAuthenticated, authorize('student'), cc.submitAttempt);
router.post('/:id/submit', isAuthenticated, authorize('student'), cc.submitChallengeProof);
router.get('/attempts/mine', isAuthenticated, authorize('student'), cc.getMyAttempts);

export default router;
