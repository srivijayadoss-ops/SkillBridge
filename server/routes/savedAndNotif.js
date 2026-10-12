import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import * as sc from '../controllers/savedAndNotifController.js';

const router = Router();

// Saved opportunities
router.post('/saved', isAuthenticated, sc.saveOpportunity);
router.post('/saved/:opportunityId', isAuthenticated, sc.saveOpportunity);
router.delete('/saved/:opportunityId', isAuthenticated, sc.unsaveOpportunity);
router.get('/saved', isAuthenticated, sc.getSavedOpportunities);

// Notifications
router.get('/notifications', isAuthenticated, sc.getNotifications);
router.put('/notifications/:id/read', isAuthenticated, sc.markNotificationRead);
router.put('/notifications/read-all', isAuthenticated, sc.markAllNotificationsRead);

export default router;
