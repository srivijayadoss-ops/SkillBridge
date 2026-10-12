import * as aiService from '../services/aiService.js';
import StudentProfile from '../models/StudentProfile.js';
import Opportunity from '../models/Opportunity.js';
import { calculateMatch } from '../services/matchingEngine.js';

export async function explainMatch(req, res, next) {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) return res.status(400).json({ error: 'Opportunity ID required.' });

    const [profile, opportunity] = await Promise.all([
      StudentProfile.findOne({ user: req.session.userId }),
      Opportunity.findById(opportunityId)
    ]);

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });

    const matchResult = calculateMatch(profile, opportunity);
    const explanation = await aiService.explainMatch(matchResult, opportunity.title, profile.skills);

    res.json({
      explanation,
      matchResult,
      aiAvailable: aiService.isAIAvailable()
    });
  } catch (err) {
    next(err);
  }
}

export async function getSkillGapAnalysis(req, res, next) {
  try {
    const { targetRole } = req.body;
    if (!targetRole) return res.status(400).json({ error: 'Target role is required.' });

    const profile = await StudentProfile.findOne({ user: req.session.userId });
    const skills = profile?.skills || [];

    const analysis = await aiService.explainSkillGaps(skills, targetRole);
    res.json({ analysis, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function getLearningPath(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const suggestions = await aiService.suggestLearningPath(
      profile.skills,
      profile.interests || []
    );
    res.json({ suggestions, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function getProjectIdeas(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const ideas = await aiService.generateProjectIdeas(profile.skills);
    res.json({ ideas, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function getCareerGuidance(req, res, next) {
  try {
    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const guidance = await aiService.getCareerGuidance(profile);
    res.json({ guidance, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function getAIStatus(req, res) {
  res.json({ available: aiService.isAIAvailable() });
}

export async function resumeReview(req, res, next) {
  try {
    const { resumeText } = req.body;
    const profile = await StudentProfile.findOne({ user: req.session.userId });

    const review = await aiService.reviewResumeContent(resumeText, profile);
    res.json({ review, score: review.score, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function interviewPrep(req, res, next) {
  try {
    const roleOrTech = req.body.roleOrTech || 'Full Stack Architecture';
    const prep = await aiService.generateInterviewPrep(roleOrTech);
    res.json({ prep, questions: prep.questions, aiAvailable: aiService.isAIAvailable() });
  } catch (err) {
    next(err);
  }
}

export async function getMatchScore(req, res, next) {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) return res.status(400).json({ error: 'Opportunity ID is required.' });

    const [profile, opportunity] = await Promise.all([
      StudentProfile.findOne({ user: req.session.userId }),
      Opportunity.findById(opportunityId)
    ]);
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found.' });

    const matchResult = calculateMatch(profile, opportunity);
    res.json({ score: matchResult.score, matchResult });
  } catch (err) {
    next(err);
  }
}

