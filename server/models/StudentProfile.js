import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: 'General' },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  evidenceType: {
    type: String,
    enum: ['self-declared', 'project-backed', 'challenge-verified'],
    default: 'self-declared'
  },
  evidenceLinks: [{ type: String, trim: true }],
  endorsements: { type: Number, default: 0 }
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  url: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  role: { type: String, trim: true },
  startDate: Date,
  endDate: Date
}, { _id: true });

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },
  headline: { type: String, trim: true, maxlength: 200 },
  bio: { type: String, trim: true, maxlength: 2000 },
  location: { type: String, trim: true },
  university: { type: String, trim: true },
  college: { type: String, trim: true },
  degree: { type: String, trim: true },
  department: { type: String, trim: true },
  graduationYear: Number,
  skills: [skillSchema],
  projects: [projectSchema],
  portfolioUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  linkedinUrl: { type: String, trim: true },
  interests: [{ type: String, trim: true }],
  careerInterests: [{ type: String, trim: true }],
  preferredWorkMode: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site', 'any'],
    default: 'any'
  },
  preferredLocations: [{ type: String, trim: true }],
  experienceYears: { type: Number, default: 0, min: 0 },
  completedChallenges: { type: Number, default: 0 },
  profileCompletion: { type: Number, default: 0, min: 0, max: 100 }
}, {
  timestamps: true
});

studentProfileSchema.index({ 'skills.name': 1 });
studentProfileSchema.index({ location: 1 });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
