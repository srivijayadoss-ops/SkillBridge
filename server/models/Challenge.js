import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['multiple-choice', 'code', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 10 },
  explanation: String
}, { _id: true });

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  skill: { type: String, required: true, trim: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 30 },
  attemptCount: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

challengeSchema.index({ skill: 1 });
challengeSchema.index({ difficulty: 1 });

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
