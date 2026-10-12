import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    enum: ['owner', 'member', 'pending'],
    default: 'pending'
  },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 3000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requiredSkills: [{ type: String, trim: true }],
  members: [memberSchema],
  maxMembers: { type: Number, default: 5 },
  status: {
    type: String,
    enum: ['recruiting', 'in-progress', 'completed'],
    default: 'recruiting'
  },
  category: { type: String, trim: true },
  repoUrl: { type: String, trim: true },
  deadline: Date
}, {
  timestamps: true
});

projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ requiredSkills: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
