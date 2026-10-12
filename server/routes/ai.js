import { Router } from 'express';
import { isAuthenticated, authorize } from '../middleware/auth.js';
import * as ai from '../controllers/aiController.js';

const router = Router();

router.get('/status', ai.getAIStatus);
router.post('/explain-match', isAuthenticated, authorize('student'), ai.explainMatch);
router.post('/match-score', isAuthenticated, authorize('student'), ai.getMatchScore);
router.post('/skill-gaps', isAuthenticated, authorize('student'), ai.getSkillGapAnalysis);
router.post('/gap-analysis', isAuthenticated, authorize('student'), ai.getSkillGapAnalysis);
router.post('/resume-review', isAuthenticated, authorize('student'), ai.resumeReview);
router.post('/interview-prep', isAuthenticated, authorize('student'), ai.interviewPrep);
router.get('/learning-path', isAuthenticated, authorize('student'), ai.getLearningPath);
router.get('/project-ideas', isAuthenticated, authorize('student'), ai.getProjectIdeas);
router.get('/career-guidance', isAuthenticated, authorize('student'), ai.getCareerGuidance);

export default router;
