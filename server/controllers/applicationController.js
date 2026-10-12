import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import StudentProfile from '../models/StudentProfile.js';
import Notification from '../models/Notification.js';
import { calculateMatch } from '../services/matchingEngine.js';

export async function applyToOpportunity(req, res, next) {
  try {
    const { opportunityId, coverLetter, portfolioUrl, availability } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ error: 'Opportunity ID is required.' });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });
    if (opportunity.status !== 'open') {
      return res.status(400).json({ error: 'This opportunity is no longer accepting applications.' });
    }

    // Check duplicate
    const existing = await Application.findOne({
      opportunity: opportunityId,
      student: req.session.userId
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already applied to this opportunity.', application: existing });
    }

    // Calculate match
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    let match = { score: 0, matchedSkills: [], missingSkills: [] };
    if (profile) {
      match = calculateMatch(profile, opportunity);
    }

    const application = new Application({
      opportunity: opportunityId,
      student: req.session.userId,
      coverLetter: coverLetter || '',
      resumeUrl: portfolioUrl || '',
      matchScore: match.score,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      status: 'submitted',
      statusHistory: [{ status: 'submitted', changedBy: req.session.userId }]
    });
    await application.save();

    // Update applicant count
    await Opportunity.findByIdAndUpdate(opportunityId, { $inc: { applicantCount: 1 } });

    res.status(201).json({ application, message: 'Application submitted successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already applied to this opportunity.' });
    }
    next(err);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({ student: req.session.userId })
      .populate('opportunity')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    next(err);
  }
}

export async function getApplicationsForOpportunity(req, res, next) {
  try {
    const { opportunityId } = req.params;

    // Verify ownership
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });
    if (opportunity.recruiter.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied: You can only view applications for your own opportunities.' });
    }

    const applications = await Application.find({ opportunity: opportunityId })
      .populate({
        path: 'student',
        select: 'name email studentId avatar'
      })
      .sort({ createdAt: -1 });

    // Enrich with profile info
    const enriched = await Promise.all(applications.map(async (app) => {
      const studentObj = app.student ? (app.student.toObject ? app.student.toObject() : app.student) : {};
      const studentUserId = studentObj._id || app.student;
      const profile = await StudentProfile.findOne({ user: studentUserId })
        .select('headline skills projects university college degree department graduationYear studentId portfolioUrl githubUrl')
        .lean();
      const appJson = app.toJSON ? app.toJSON() : app;
      return { 
        ...appJson, 
        student: {
          ...studentObj,
          user: studentObj,
          ...(profile || {})
        }
      };
    }));

    res.json({ applications: enriched });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { applicationId } = req.params;
    let { status, note, feedback } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    // Normalize status aliases
    const statusMap = {
      'applied': 'submitted',
      'reviewing': 'under-review',
      'under-review': 'under-review',
      'submitted': 'submitted',
      'shortlisted': 'shortlisted',
      'interview': 'interview',
      'offered': 'offered',
      'accepted': 'accepted',
      'rejected': 'rejected',
      'withdrawn': 'withdrawn'
    };

    const normalizedStatus = statusMap[status.toLowerCase()] || status;
    const validStatuses = ['submitted', 'applied', 'under-review', 'reviewing', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ error: `Invalid application status: ${status}.` });
    }

    const application = await Application.findById(applicationId).populate('opportunity');
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    // Verify recruiter owns the opportunity
    if (application.opportunity.recruiter.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied: You can only review applications for your own opportunities.' });
    }

    application.status = normalizedStatus;
    application.statusHistory.push({
      status: normalizedStatus,
      changedBy: req.session.userId,
      note: note || feedback || ''
    });
    await application.save();

    // Send persistent notification to student
    const statusLabels = {
      'submitted': 'Submitted',
      'under-review': 'Under Review',
      'shortlisted': 'Shortlisted! 🎉',
      'accepted': 'Accepted / Offered! 🚀',
      'rejected': 'Update on your application'
    };
    const title = statusLabels[normalizedStatus] || 'Application Update';
    const message = `Your application for "${application.opportunity.title}" has been updated to: ${normalizedStatus.toUpperCase()}.`;

    await Notification.create({
      user: application.student,
      type: 'application-update',
      title,
      message,
      link: '/student-dashboard',
      relatedId: application._id
    });

    res.json({ application, message: `Application status updated to ${normalizedStatus}.` });
  } catch (err) {
    next(err);
  }
}

export async function withdrawApplication(req, res, next) {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    if (application.student.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    application.status = 'withdrawn';
    application.statusHistory.push({
      status: 'withdrawn',
      changedBy: req.session.userId
    });
    await application.save();

    res.json({ application, message: 'Application withdrawn.' });
  } catch (err) {
    next(err);
  }
}
