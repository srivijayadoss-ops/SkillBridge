import { Router } from 'express';
import { isAuthenticated, authorize, attachUser } from '../middleware/auth.js';
import * as oc from '../controllers/opportunityController.js';
import { applyToOpportunity } from '../controllers/applicationController.js';

const router = Router();

// Public
router.get('/', oc.getOpportunities);
router.get('/:id', attachUser, oc.getOpportunity);

// Student Actions
router.post('/:id/apply', isAuthenticated, authorize('student'), (req, res, next) => {
  req.body.opportunityId = req.params.id;
  return applyToOpportunity(req, res, next);
});
router.get('/student/recommendations', isAuthenticated, authorize('student'), oc.getRecommendations);

// Recruiter
router.post('/', isAuthenticated, authorize('recruiter'), oc.createOpportunity);
router.put('/:id', isAuthenticated, authorize('recruiter'), oc.updateOpportunity);
router.delete('/:id', isAuthenticated, authorize('recruiter'), oc.deleteOpportunity);
router.get('/recruiter/mine', isAuthenticated, authorize('recruiter'), oc.getRecruiterOpportunities);

export default router;
