import SavedOpportunity from '../models/SavedOpportunity.js';
import Notification from '../models/Notification.js';

export async function saveOpportunity(req, res, next) {
  try {
    const opportunityId = req.params.opportunityId || req.body.opportunityId;
    if (!opportunityId) return res.status(400).json({ error: 'Opportunity ID required.' });

    const existing = await SavedOpportunity.findOne({
      user: req.session.userId,
      opportunity: opportunityId
    });
    if (existing) {
      return res.status(409).json({ error: 'Already saved.' });
    }

    await SavedOpportunity.create({
      user: req.session.userId,
      opportunity: opportunityId
    });
    res.status(201).json({ message: 'Opportunity saved.' });
  } catch (err) {
    next(err);
  }
}

export async function unsaveOpportunity(req, res, next) {
  try {
    await SavedOpportunity.findOneAndDelete({
      user: req.session.userId,
      opportunity: req.params.opportunityId
    });
    res.json({ message: 'Opportunity unsaved.' });
  } catch (err) {
    next(err);
  }
}

export async function getSavedOpportunities(req, res, next) {
  try {
    const saved = await SavedOpportunity.find({ user: req.session.userId })
      .populate('opportunity')
      .sort({ createdAt: -1 });
    res.json({ saved: saved.map(s => s.opportunity).filter(Boolean) });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.session.userId, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { read: true }
    );
    res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    await Notification.updateMany(
      { user: req.session.userId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
}
