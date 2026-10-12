import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['application-update', 'new-match', 'challenge-complete', 'project-invite', 'system', 'opportunity-deadline'],
    default: 'system'
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  link: { type: String, trim: true },
  read: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
