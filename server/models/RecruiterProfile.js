import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: { type: String, trim: true, required: [true, 'Company name is required'] },
  companyWebsite: { type: String, trim: true },
  industry: { type: String, trim: true },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10'
  },
  location: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 2000 },
  logo: { type: String, trim: true }
}, {
  timestamps: true
});

// Indexes handled via field definitions

const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);
export default RecruiterProfile;
