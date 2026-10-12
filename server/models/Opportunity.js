import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 5000
  },
  type: {
    type: String,
    enum: ['job', 'internship', 'freelance', 'project'],
    required: [true, 'Opportunity type is required']
  },
  category: { type: String, trim: true, default: 'General' },
  requiredSkills: [{
    name: { type: String, required: true, trim: true },
    importance: {
      type: String,
      enum: ['required', 'preferred', 'nice-to-have'],
      default: 'required'
    },
    minProficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    }
  }],
  experienceRequired: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 99 }
  },
  location: { type: String, trim: true },
  workMode: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site'],
    default: 'remote'
  },
  compensation: {
    type: { type: String, enum: ['paid', 'unpaid', 'stipend', 'equity', 'negotiable'], default: 'negotiable' },
    amount: String,
    currency: { type: String, default: 'INR' }
  },
  eligibility: { type: String, trim: true, maxlength: 1000 },
  deadline: Date,
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open'
  },
  applicantCount: { type: Number, default: 0 },
  maxApplicants: Number,
  companyName: { type: String, trim: true },
  companyLogo: { type: String, trim: true }
}, {
  timestamps: true
});

opportunitySchema.index({ recruiter: 1 });
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ 'requiredSkills.name': 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ title: 'text', description: 'text' });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
