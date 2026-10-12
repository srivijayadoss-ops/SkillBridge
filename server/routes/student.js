import { Router } from 'express';
import { isAuthenticated, authorize } from '../middleware/auth.js';
import * as sc from '../controllers/studentController.js';

const router = Router();

router.get('/profile', isAuthenticated, authorize('student'), sc.getProfile);
router.put('/profile', isAuthenticated, authorize('student'), sc.updateProfile);
router.get('/recommendations', isAuthenticated, authorize('student'), sc.getRecommendations);
router.post('/skills', isAuthenticated, authorize('student'), sc.addSkill);
router.put('/skills/:skillId', isAuthenticated, authorize('student'), sc.updateSkill);
router.delete('/skills/:skillId', isAuthenticated, authorize('student'), sc.removeSkill);
router.post('/projects', isAuthenticated, authorize('student'), sc.addProject);
router.put('/projects/:projectId', isAuthenticated, authorize('student'), sc.updateProject);
router.delete('/projects/:projectId', isAuthenticated, authorize('student'), sc.removeProject);
router.get('/public/:userId', sc.getPublicProfile);

export default router;
