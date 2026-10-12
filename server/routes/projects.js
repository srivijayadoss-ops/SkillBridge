import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import * as pc from '../controllers/projectController.js';

const router = Router();

router.get('/', pc.getProjects);
router.get('/mine', isAuthenticated, pc.getMyProjects);
router.get('/:id', pc.getProject);
router.post('/', isAuthenticated, pc.createProject);
router.post('/:id/join', isAuthenticated, pc.requestToJoin);
router.put('/:id/members', isAuthenticated, pc.handleJoinRequest);
router.get('/:id/team-recommendations', isAuthenticated, pc.getTeamRecommendations);

export default router;
