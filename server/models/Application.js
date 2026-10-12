import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: { type: String, trim: true, maxlength: 3000 },
  resumeUrl: { type: String, trim: true },
  status: {
    type: String,
    enum: ['submitted', 'applied', 'under-review', 'reviewing', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted'
  },
  statusHistory: [statusHistorySchema],
  matchScore: { type: Number, min: 0, max: 100 },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }]
}, {
  timestamps: true
});

applicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1 });
applicationSchema.index({ opportunity: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
