import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';

export async function getProfile(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = [
      'headline', 'bio', 'location', 'university', 'college', 'degree', 'department', 'graduationYear',
      'portfolioUrl', 'githubUrl', 'linkedinUrl', 'interests', 'careerInterests',
      'preferredWorkMode', 'preferredLocations', 'experienceYears'
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Calculate profile completion
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    Object.assign(profile, updates);
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.json({ profile, message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function addSkill(req, res, next) {
  try {
    const { name, category, proficiency, evidenceType, evidenceLinks } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    // Check for duplicate skill
    const exists = profile.skills.some(
      s => s.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (exists) {
      return res.status(409).json({ error: 'This skill already exists in your profile.' });
    }

    profile.skills.push({
      name: name.trim(),
      category: category || 'General',
      proficiency: proficiency || 'beginner',
      evidenceType: evidenceType || 'self-declared',
      evidenceLinks: evidenceLinks || []
    });
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.status(201).json({ profile, message: 'Skill added successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function removeSkill(req, res, next) {
  try {
    const { skillId } = req.params;
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const target = decodeURIComponent(skillId).toLowerCase().trim();
    profile.skills = profile.skills.filter(s => 
      s._id.toString() !== skillId && s.name.toLowerCase().trim() !== target
    );
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.json({ profile, message: 'Skill removed.' });
  } catch (err) {
    next(err);
  }
}

export async function updateSkill(req, res, next) {
  try {
    const { skillId } = req.params;
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const skill = profile.skills.id(skillId);
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });

    const allowed = ['name', 'category', 'proficiency', 'evidenceType', 'evidenceLinks'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) skill[key] = req.body[key];
    }
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.json({ profile, message: 'Skill updated.' });
  } catch (err) {
    next(err);
  }
}

export async function addProject(req, res, next) {
  try {
    const { title, description, url, githubUrl, liveUrl, techStack, skills, role, startDate, endDate } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const projectUrl = url || liveUrl || githubUrl || '';
    const projectSkills = Array.isArray(skills) ? skills : (Array.isArray(techStack) ? techStack : []);

    profile.projects.push({
      title: title.trim(),
      description: description || '',
      url: projectUrl,
      skills: projectSkills,
      role: role || 'Developer',
      startDate,
      endDate
    });
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.status(201).json({ profile, message: 'Project added successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const project = profile.projects.id(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const { title, description, url, githubUrl, liveUrl, techStack, skills, role, startDate, endDate } = req.body;
    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description;
    if (url !== undefined || liveUrl !== undefined || githubUrl !== undefined) {
      project.url = url || liveUrl || githubUrl || project.url;
    }
    if (skills !== undefined || techStack !== undefined) {
      project.skills = Array.isArray(skills) ? skills : (Array.isArray(techStack) ? techStack : project.skills);
    }
    if (role !== undefined) project.role = role;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;

    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.json({ profile, message: 'Project updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function removeProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    profile.projects = profile.projects.filter(p => p._id.toString() !== projectId);
    profile.profileCompletion = calculateCompletion(profile);
    await profile.save();

    res.json({ profile, message: 'Project removed.' });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const profile = await StudentProfile.findOne({ user: userId }).populate('user', 'name');
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    // Return safe public view
    res.json({
      profile: {
        name: profile.user?.name,
        headline: profile.headline,
        skills: profile.skills.map(s => ({ name: s.name, proficiency: s.proficiency, evidenceType: s.evidenceType })),
        projects: profile.projects,
        university: profile.university,
        location: profile.location
      }
    });
  } catch (err) {
    next(err);
  }
}

function calculateCompletion(profile) {
  let score = 0;
  const total = 10;
  if (profile.headline) score++;
  if (profile.bio) score++;
  if (profile.location) score++;
  if (profile.university) score++;
  if (profile.degree) score++;
  if (profile.skills && profile.skills.length > 0) score++;
  if (profile.skills && profile.skills.length >= 3) score++;
  if (profile.projects && profile.projects.length > 0) score++;
  if (profile.interests && profile.interests.length > 0) score++;
  if (profile.portfolioUrl || profile.githubUrl) score++;
  return Math.round((score / total) * 100);
}

export async function getRecommendations(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    const opportunities = await Opportunity.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const Application = (await import('../models/Application.js')).default;
    const applications = await Application.find({ student: req.session.userId }).select('opportunity status');
    const appliedOppMap = new Map();
    applications.forEach(a => appliedOppMap.set(a.opportunity.toString(), a.status));

    const studentSkills = new Set((profile?.skills || []).map(s => s.name.toLowerCase().trim()));

    const recommendations = opportunities.map(opp => {
      const oppId = opp._id.toString();
      const isApplied = appliedOppMap.has(oppId);
      const appStatus = appliedOppMap.get(oppId) || null;
      const required = opp.requiredSkills || [];

      if (required.length === 0) {
        return { 
          ...opp, 
          matchScore: 85, 
          matchingSkills: [],
          isApplied,
          applicationStatus: appStatus
        };
      }
      const matched = required.filter(r => studentSkills.has(r.name.toLowerCase().trim()));
      const score = Math.min(100, Math.max(45, Math.round((matched.length / required.length) * 100)));
      return {
        ...opp,
        matchScore: score,
        matchingSkills: matched.map(m => m.name),
        isApplied,
        applicationStatus: appStatus
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

