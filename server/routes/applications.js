import { Router } from 'express';
import { isAuthenticated, authorize } from '../middleware/auth.js';
import * as ac from '../controllers/applicationController.js';

const router = Router();

// Student
router.post('/', isAuthenticated, authorize('student'), ac.applyToOpportunity);
router.get('/my', isAuthenticated, authorize('student'), ac.getMyApplications);
router.get('/mine', isAuthenticated, authorize('student'), ac.getMyApplications);
router.put('/:applicationId/withdraw', isAuthenticated, authorize('student'), ac.withdrawApplication);

// Recruiter
router.get('/opportunity/:opportunityId', isAuthenticated, authorize('recruiter'), ac.getApplicationsForOpportunity);
router.put('/:applicationId/status', isAuthenticated, authorize('recruiter'), ac.updateApplicationStatus);

export default router;
