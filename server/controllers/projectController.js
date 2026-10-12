import Project from '../models/Project.js';
import StudentProfile from '../models/StudentProfile.js';
import { findComplementaryTeammates } from '../services/matchingEngine.js';

export async function createProject(req, res, next) {
  try {
    const { title, description, requiredSkills, maxMembers, category, repoUrl, deadline } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    const project = new Project({
      title,
      description,
      owner: req.session.userId,
      requiredSkills: requiredSkills || [],
      maxMembers: maxMembers || 5,
      category,
      repoUrl,
      deadline,
      members: [{ user: req.session.userId, role: 'owner' }]
    });
    await project.save();

    res.status(201).json({ project, message: 'Project created.' });
  } catch (err) {
    next(err);
  }
}

export async function getProjects(req, res, next) {
  try {
    const { status, skill } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };

    const projects = await Project.find(filter)
      .populate('owner', 'name')
      .populate('members.user', 'name')
      .sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name');
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function requestToJoin(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (project.status !== 'recruiting') {
      return res.status(400).json({ error: 'This project is not recruiting.' });
    }

    const isMember = project.members.some(m => m.user.toString() === req.session.userId);
    if (isMember) {
      return res.status(409).json({ error: 'You are already a member or have a pending request.' });
    }

    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({ error: 'This project is full.' });
    }

    project.members.push({ user: req.session.userId, role: 'pending' });
    await project.save();

    res.json({ message: 'Join request submitted.' });
  } catch (err) {
    next(err);
  }
}

export async function handleJoinRequest(req, res, next) {
  try {
    const { userId, action } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (project.owner.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Only the project owner can manage requests.' });
    }

    const member = project.members.find(m => m.user.toString() === userId);
    if (!member) return res.status(404).json({ error: 'Request not found.' });

    if (action === 'accept') {
      member.role = 'member';
    } else {
      project.members = project.members.filter(m => m.user.toString() !== userId);
    }
    await project.save();

    res.json({ message: `Request ${action}ed.` });
  } catch (err) {
    next(err);
  }
}

export async function getMyProjects(req, res, next) {
  try {
    const projects = await Project.find({
      'members.user': req.session.userId
    })
      .populate('owner', 'name')
      .populate('members.user', 'name')
      .sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function getTeamRecommendations(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    if (!project.requiredSkills || project.requiredSkills.length === 0) {
      return res.json({ recommendations: [], message: 'Add required skills to get team recommendations.' });
    }

    // Get all student profiles except current members
    const memberIds = project.members.map(m => m.user.toString());
    const profiles = await StudentProfile.find({
      user: { $nin: memberIds }
    }).populate('user', 'name');

    const recommendations = findComplementaryTeammates(project.requiredSkills, profiles);

    res.json({
      recommendations: recommendations.slice(0, 10).map(r => ({
        userId: r.profile.user?._id,
        name: r.profile.user?.name,
        complementarySkills: r.complementarySkills,
        coverageScore: r.coverageScore,
        headline: r.profile.headline,
        skills: r.profile.skills.map(s => ({ name: s.name, proficiency: s.proficiency }))
      }))
    });
  } catch (err) {
    next(err);
  }
}
