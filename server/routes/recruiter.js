import { Router } from 'express';
import { isAuthenticated, authorize } from '../middleware/auth.js';
import * as rc from '../controllers/recruiterController.js';

const router = Router();

router.get('/profile', isAuthenticated, authorize('recruiter'), rc.getProfile);
router.put('/profile', isAuthenticated, authorize('recruiter'), rc.updateProfile);
router.get('/dashboard', isAuthenticated, authorize('recruiter'), rc.getDashboard);
router.get('/matches/:oppId', isAuthenticated, authorize('recruiter'), rc.getCandidateMatches);
router.get('/students', isAuthenticated, authorize('recruiter'), rc.getStudentDirectory);
router.get('/students/:id', isAuthenticated, authorize('recruiter'), rc.getStudentProfileDetail);

export default router;
