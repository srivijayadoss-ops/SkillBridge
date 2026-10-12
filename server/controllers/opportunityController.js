import Opportunity from '../models/Opportunity.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import { calculateMatch, rankOpportunities } from '../services/matchingEngine.js';

export async function createOpportunity(req, res, next) {
  try {
    const { title, description, type, category, requiredSkills, experienceRequired,
            location, workMode, compensation, eligibility, deadline, maxApplicants } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Title, description, and type are required.' });
    }
    if (!['job', 'internship', 'freelance', 'project'].includes(type)) {
      return res.status(400).json({ error: 'Invalid opportunity type.' });
    }

    // Get recruiter company info
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.session.userId });

    // Format skills if sent as string array
    const formattedSkills = (requiredSkills || []).map(s => {
      if (typeof s === 'string') return { name: s.trim(), importance: 'required', minProficiency: 'intermediate' };
      return s;
    });

    const opportunity = new Opportunity({
      recruiter: req.session.userId,
      title, description, type, category,
      requiredSkills: formattedSkills,
      experienceRequired: experienceRequired || { min: 0, max: 99 },
      location, workMode: workMode || 'remote',
      compensation: compensation || {},
      eligibility, deadline, maxApplicants,
      companyName: recruiterProfile?.companyName || '',
      companyLogo: recruiterProfile?.logo || ''
    });
    await opportunity.save();

    res.status(201).json({ opportunity, message: 'Opportunity created successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function updateOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });

    // Ownership check
    if (opportunity.recruiter.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'You can only edit your own opportunities.' });
    }

    const allowed = ['title', 'description', 'type', 'category', 'requiredSkills',
      'experienceRequired', 'location', 'workMode', 'compensation', 'eligibility',
      'deadline', 'status', 'maxApplicants'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        opportunity[key] = req.body[key];
      }
    }
    await opportunity.save();

    res.json({ opportunity, message: 'Opportunity updated.' });
  } catch (err) {
    next(err);
  }
}

export async function deleteOpportunity(req, res, next) {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });
    if (opportunity.recruiter.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'You can only delete your own opportunities.' });
    }
    await Opportunity.findByIdAndDelete(id);
    res.json({ message: 'Opportunity deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function getOpportunities(req, res, next) {
  try {
    const { search, type, workMode, location, sort, page = 1, limit = 12 } = req.query;
    const filter = { status: 'open' };

    if (search) {
      filter.$text = { $search: search };
    }
    if (type) filter.type = type;
    if (workMode) filter.workMode = workMode;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const sortOptions = {};
    if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'deadline') sortOptions.deadline = 1;
    else sortOptions.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter).sort(sortOptions).skip(skip).limit(parseInt(limit)),
      Opportunity.countDocuments(filter)
    ]);

    res.json({
      opportunities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getOpportunity(req, res, next) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });

    // If authenticated student, calculate match and application status
    let match = null;
    let application = null;
    if (req.session?.userId && req.session?.userRole === 'student') {
      const profile = await StudentProfile.findOne({ user: req.session.userId });
      if (profile) {
        match = calculateMatch(profile, opportunity);
      }
      application = await Application.findOne({
        opportunity: req.params.id,
        student: req.session.userId
      });
    }

    res.json({ 
      opportunity, 
      match, 
      application,
      isApplied: Boolean(application) 
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecruiterOpportunities(req, res, next) {
  try {
    const opportunities = await Opportunity.find({ recruiter: req.session.userId })
      .sort({ createdAt: -1 });
    res.json({ opportunities });
  } catch (err) {
    next(err);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Create your profile first.' });

    const opportunities = await Opportunity.find({ status: 'open' }).limit(50);
    const ranked = rankOpportunities(profile, opportunities);

    res.json({
      recommendations: ranked.slice(0, 20).map(r => ({
        opportunity: r.opportunity,
        matchScore: r.match.score,
        matchedSkills: r.match.matchedSkills,
        missingSkills: r.match.missingSkills,
        reasons: r.match.reasons,
        nextActions: r.match.nextActions,
        breakdown: r.match.breakdown
      }))
    });
  } catch (err) {
    next(err);
  }
}
