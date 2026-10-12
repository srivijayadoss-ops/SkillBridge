import mongoose from 'mongoose';

const attemptAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const challengeAttemptSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [attemptAnswerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  timeTaken: Number,
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

challengeAttemptSchema.index({ challenge: 1, student: 1 });
challengeAttemptSchema.index({ student: 1 });

const ChallengeAttempt = mongoose.model('ChallengeAttempt', challengeAttemptSchema);
export default ChallengeAttempt;
