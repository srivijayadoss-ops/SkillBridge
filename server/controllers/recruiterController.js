import RecruiterProfile from '../models/RecruiterProfile.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.session.userId }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ error: 'Recruiter profile not found.' });
    }
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ['companyName', 'companyWebsite', 'industry', 'companySize', 'location', 'description', 'logo'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: req.session.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ error: 'Recruiter profile not found.' });

    res.json({ profile, message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const opportunities = await Opportunity.find({ recruiter: req.session.userId })
      .sort({ createdAt: -1 })
      .lean();

    const oppIds = opportunities.map(o => o._id);

    // Aggregate true application counts per opportunity
    const appCounts = await Application.aggregate([
      { $match: { opportunity: { $in: oppIds } } },
      { $group: { _id: '$opportunity', count: { $sum: 1 } } }
    ]);
    const countsMap = new Map(appCounts.map(c => [c._id.toString(), c.count]));

    const oppsWithCounts = opportunities.map(o => {
      const realCount = countsMap.get(o._id.toString()) || 0;
      return {
        ...o,
        applicantCount: realCount,
        applicantsCount: realCount
      };
    });

    const totalApplications = await Application.countDocuments({ opportunity: { $in: oppIds } });

    res.json({
      opportunities: oppsWithCounts,
      totalApplications,
      totalActiveRoles: opportunities.filter(o => o.status === 'open').length
    });
  } catch (err) {
    next(err);
  }
}

export async function getCandidateMatches(req, res, next) {
  try {
    const { oppId } = req.params;
    const opportunity = await Opportunity.findOne({ _id: oppId, recruiter: req.session.userId });
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    const requiredSkillNames = (opportunity.requiredSkills || []).map(s => s.name.toLowerCase().trim());
    const candidates = await StudentProfile.find({})
      .populate('user', 'name email')
      .limit(20)
      .lean();

    const matches = candidates.map(cand => {
      const candSkills = new Set((cand.skills || []).map(s => s.name.toLowerCase().trim()));
      const matched = requiredSkillNames.filter(name => candSkills.has(name));
      const score = requiredSkillNames.length > 0 
        ? Math.round((matched.length / requiredSkillNames.length) * 100) 
        : 75;

      return {
        student: cand.user,
        profile: cand,
        matchScore: score,
        matchedSkills: matched
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ matches });
  } catch (err) {
    next(err);
  }
}

export async function getStudentDirectory(req, res, next) {
  try {
    const { search, skill, college, university, department } = req.query;
    const filter = {};

    if (college || university) {
      const term = college || university;
      filter.$or = [
        { college: { $regex: term, $options: 'i' } },
        { university: { $regex: term, $options: 'i' } }
      ];
    }
    if (department) {
      filter.$or = [
        { department: { $regex: department, $options: 'i' } },
        { degree: { $regex: department, $options: 'i' } }
      ];
    }
    if (skill) {
      filter['skills.name'] = { $regex: skill, $options: 'i' };
    }

    let profiles = await StudentProfile.find(filter)
      .populate('user', 'name email avatar role')
      .sort({ updatedAt: -1 })
      .lean();

    // In-memory filter for search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      profiles = profiles.filter(p => {
        const name = p.user?.name?.toLowerCase() || '';
        const email = p.user?.email?.toLowerCase() || '';
        const stuId = p.studentId?.toLowerCase() || '';
        const coll = p.college?.toLowerCase() || p.university?.toLowerCase() || '';
        const deg = p.degree?.toLowerCase() || p.department?.toLowerCase() || '';
        const skillMatch = (p.skills || []).some(s => s.name?.toLowerCase().includes(q));
        const interestMatch = (p.interests || p.careerInterests || []).some(i => i?.toLowerCase().includes(q));
        return name.includes(q) || email.includes(q) || stuId.includes(q) || coll.includes(q) || deg.includes(q) || skillMatch || interestMatch;
      });
    }

    const students = profiles.map(p => ({
      _id: p._id,
      userId: p.user?._id,
      studentId: p.studentId || `STU-${p._id.toString().substring(18).toUpperCase()}`,
      name: p.user?.name || 'Student Candidate',
      email: p.user?.email || '',
      headline: p.headline || '',
      bio: p.bio || '',
      college: p.college || p.university || 'University Partner',
      university: p.university || p.college || 'University Partner',
      degree: p.degree || p.department || 'Computer Science',
      department: p.department || p.degree || 'Engineering',
      graduationYear: p.graduationYear || 2026,
      skills: p.skills || [],
      projects: p.projects || [],
      interests: p.careerInterests?.length ? p.careerInterests : (p.interests || []),
      careerInterests: p.careerInterests?.length ? p.careerInterests : (p.interests || []),
      profileCompletion: p.profileCompletion || 70,
      completedChallenges: p.completedChallenges || 0
    }));

    res.json({ students, total: students.length });
  } catch (err) {
    next(err);
  }
}

export async function getStudentProfileDetail(req, res, next) {
  try {
    const { id } = req.params;
    let profile = null;

    if (id.startsWith('STU-')) {
      profile = await StudentProfile.findOne({ studentId: id }).populate('user', 'name email avatar role');
    } else {
      profile = await StudentProfile.findOne({
        $or: [{ _id: id }, { user: id }, { studentId: id }]
      }).populate('user', 'name email avatar role');
    }

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    res.json({
      student: {
        _id: profile._id,
        userId: profile.user?._id,
        studentId: profile.studentId || `STU-${profile._id.toString().substring(18).toUpperCase()}`,
        name: profile.user?.name || 'Student Candidate',
        email: profile.user?.email || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        college: profile.college || profile.university || 'University Partner',
        university: profile.university || profile.college || 'University Partner',
        degree: profile.degree || profile.department || 'Computer Science',
        department: profile.department || profile.degree || 'Engineering',
        graduationYear: profile.graduationYear || 2026,
        skills: profile.skills || [],
        projects: profile.projects || [],
        interests: profile.careerInterests?.length ? profile.careerInterests : (profile.interests || []),
        careerInterests: profile.careerInterests?.length ? profile.careerInterests : (profile.interests || []),
        profileCompletion: profile.profileCompletion || 70,
        completedChallenges: profile.completedChallenges || 0
      }
    });
  } catch (err) {
    next(err);
  }
}

