import Challenge from '../models/Challenge.js';
import ChallengeAttempt from '../models/ChallengeAttempt.js';
import StudentProfile from '../models/StudentProfile.js';

export async function getChallenges(req, res, next) {
  try {
    const { skill, difficulty } = req.query;
    const filter = { status: 'active' };
    if (skill) filter.skill = { $regex: skill, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;

    // Return challenges without correct answers
    const challenges = await Challenge.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });
    res.json({ challenges });
  } catch (err) {
    next(err);
  }
}

export async function getChallenge(req, res, next) {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation');
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
    res.json({ challenge });
  } catch (err) {
    next(err);
  }
}

export async function submitAttempt(req, res, next) {
  try {
    const { challengeId, answers, timeTaken } = req.body;
    if (!challengeId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Challenge ID and answers are required.' });
    }

    // Get challenge with correct answers (server-side only)
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    // Grade
    let totalScore = 0;
    let maxScore = 0;
    const gradedAnswers = [];

    for (const question of challenge.questions) {
      maxScore += question.points;
      const studentAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = studentAnswer &&
        studentAnswer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;

      gradedAnswers.push({
        questionId: question._id,
        answer: studentAnswer?.answer || '',
        isCorrect,
        pointsEarned
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= 70;

    const attempt = new ChallengeAttempt({
      challenge: challengeId,
      student: req.session.userId,
      answers: gradedAnswers,
      totalScore,
      maxScore,
      percentage,
      passed,
      timeTaken
    });
    await attempt.save();

    // Update challenge stats
    challenge.attemptCount += 1;
    challenge.avgScore = Math.round(
      ((challenge.avgScore * (challenge.attemptCount - 1)) + percentage) / challenge.attemptCount
    );
    await challenge.save();

    // If passed, update student skill evidence
    if (passed) {
      const profile = await StudentProfile.findOne({ user: req.session.userId });
      if (profile) {
        const skill = profile.skills.find(
          s => s.name.toLowerCase() === challenge.skill.toLowerCase()
        );
        if (skill) {
          skill.evidenceType = 'challenge-verified';
        }
        profile.completedChallenges = (profile.completedChallenges || 0) + 1;
        await profile.save();
      }
    }

    res.status(201).json({
      attempt: {
        totalScore,
        maxScore,
        percentage,
        passed,
        answers: gradedAnswers.map(a => ({
          questionId: a.questionId,
          isCorrect: a.isCorrect,
          pointsEarned: a.pointsEarned
        }))
      },
      message: passed
        ? `Congratulations! You passed with ${percentage}%.`
        : `You scored ${percentage}%. You need 70% to pass. Try again!`
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyAttempts(req, res, next) {
  try {
    const attempts = await ChallengeAttempt.find({ student: req.session.userId })
      .populate('challenge', 'title skill difficulty')
      .sort({ createdAt: -1 });
    res.json({ attempts });
  } catch (err) {
    next(err);
  }
}

export async function submitChallengeProof(req, res, next) {
  try {
    const challengeId = req.params.id || req.body.challengeId;
    const { githubUrl, liveUrl, notes, answers, codeSolution } = req.body;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    let totalScore = 0;
    let maxScore = 0;
    let passed = true;
    let percentage = 100;
    const gradedAnswers = [];

    if (answers && Array.isArray(answers) && challenge.questions?.length > 0) {
      for (const question of challenge.questions) {
        const pts = question.points || 10;
        maxScore += pts;
        const studentAnswer = answers.find(a => a.questionId === question._id.toString());
        const isCorrect = studentAnswer &&
          studentAnswer.answer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
        const pointsEarned = isCorrect ? pts : 0;
        totalScore += pointsEarned;

        gradedAnswers.push({
          questionId: question._id,
          answer: studentAnswer?.answer || '',
          isCorrect,
          pointsEarned
        });
      }
      percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
      passed = percentage >= 60;
    }

    const profile = await StudentProfile.findOne({ user: req.session.userId });
    if (profile) {
      const skill = profile.skills.find(
        s => s.name.toLowerCase() === challenge.skill.toLowerCase()
      );
      if (skill) {
        skill.evidenceType = 'challenge-verified';
        if (githubUrl && !skill.evidenceLinks?.includes(githubUrl)) {
          skill.evidenceLinks = [...(skill.evidenceLinks || []), githubUrl];
        }
      } else if (challenge.skill) {
        profile.skills.push({
          name: challenge.skill,
          category: 'Technical',
          proficiency: 'intermediate',
          evidenceType: 'challenge-verified',
          evidenceLinks: githubUrl ? [githubUrl] : []
        });
      }
      profile.completedChallenges = (profile.completedChallenges || 0) + 1;
      profile.readinessScore = Math.min(100, (profile.readinessScore || 75) + 5);
      await profile.save();
    }

    challenge.attemptCount = (challenge.attemptCount || 0) + 1;
    await challenge.save();

    res.status(201).json({
      message: passed
        ? `Challenge successfully verified! Scored ${percentage}% (+${challenge.rewardXp || challenge.totalPoints || 250} XP)`
        : `Challenge submitted! You scored ${percentage}%. Great effort!`,
      rewardXp: challenge.rewardXp || challenge.totalPoints || 250,
      score: totalScore,
      maxScore,
      percentage,
      passed,
      gradedAnswers
    });
  } catch (err) {
    next(err);
  }
}
