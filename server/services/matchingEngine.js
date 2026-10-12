/**
 * SkillSwap Deterministic Matching Engine
 *
 * Scoring methodology:
 * 1. Skill Match (60%): Compares student skills against required skills
 *    - Exact skill name match (case-insensitive)
 *    - Proficiency level comparison adds bonus points
 *    - Evidence-backed skills receive additional weight
 *    - Required skills weighted 3x, preferred 2x, nice-to-have 1x
 *
 * 2. Experience Match (15%): Compares years of experience
 *    - Full points if within range, partial if close
 *
 * 3. Work Mode Match (10%): Preference alignment
 *    - Full points for exact match or "any" preference
 *
 * 4. Location Match (10%): Location preference alignment
 *
 * 5. Project Evidence (5%): Bonus for relevant project portfolio
 *
 * Final score normalized to 0-100.
 */

const PROFICIENCY_LEVELS = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };

function normalizeSkillName(name) {
  return name.toLowerCase().trim().replace(/[.\-_]/g, '').replace(/\s+/g, ' ');
}

function calculateSkillMatch(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { score: 100, matchedSkills: [], missingSkills: [], details: [] };
  }

  const studentMap = new Map();
  for (const s of studentSkills) {
    studentMap.set(normalizeSkillName(s.name), s);
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const details = [];

  for (const req of requiredSkills) {
    const weight = req.importance === 'required' ? 3 : req.importance === 'preferred' ? 2 : 1;
    totalWeight += weight;
    const normName = normalizeSkillName(req.name);
    const studentSkill = studentMap.get(normName);

    if (studentSkill) {
      let skillScore = weight;
      const studentLevel = PROFICIENCY_LEVELS[studentSkill.proficiency] || 1;
      const requiredLevel = PROFICIENCY_LEVELS[req.minProficiency] || 1;

      // Proficiency bonus: up to 20% extra if student exceeds requirements
      if (studentLevel >= requiredLevel) {
        skillScore *= 1 + 0.2 * Math.min((studentLevel - requiredLevel) / 3, 1);
      } else {
        skillScore *= 0.6 + 0.4 * (studentLevel / requiredLevel);
      }

      // Evidence bonus: 10% extra for verified skills
      if (studentSkill.evidenceType === 'challenge-verified') {
        skillScore *= 1.1;
      } else if (studentSkill.evidenceType === 'project-backed') {
        skillScore *= 1.05;
      }

      earnedWeight += Math.min(skillScore, weight * 1.3);
      matchedSkills.push(req.name);
      details.push({
        skill: req.name,
        matched: true,
        studentProficiency: studentSkill.proficiency,
        requiredProficiency: req.minProficiency,
        evidenceType: studentSkill.evidenceType,
        importance: req.importance
      });
    } else {
      missingSkills.push(req.name);
      details.push({
        skill: req.name,
        matched: false,
        importance: req.importance,
        requiredProficiency: req.minProficiency
      });
    }
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  return { score: Math.min(score, 100), matchedSkills, missingSkills, details };
}

function calculateExperienceMatch(studentYears, required) {
  if (!required || (required.min === 0 && required.max >= 99)) return 100;
  if (studentYears >= required.min && studentYears <= required.max) return 100;
  if (studentYears < required.min) {
    const diff = required.min - studentYears;
    return Math.max(0, 100 - diff * 25);
  }
  return 80; // Overqualified slightly penalized
}

function calculateWorkModeMatch(studentPref, opportunityMode) {
  if (!studentPref || studentPref === 'any') return 100;
  if (studentPref === opportunityMode) return 100;
  if (studentPref === 'hybrid' || opportunityMode === 'hybrid') return 70;
  return 30;
}

function calculateLocationMatch(studentLocations, opportunityLocation, workMode) {
  if (workMode === 'remote') return 100;
  if (!opportunityLocation || !studentLocations || studentLocations.length === 0) return 70;
  const normOpp = opportunityLocation.toLowerCase().trim();
  for (const loc of studentLocations) {
    if (normOpp.includes(loc.toLowerCase().trim()) || loc.toLowerCase().trim().includes(normOpp)) {
      return 100;
    }
  }
  return 40;
}

function calculateProjectEvidence(studentProjects, requiredSkills) {
  if (!studentProjects || studentProjects.length === 0) return 0;
  if (!requiredSkills || requiredSkills.length === 0) return 50;

  const requiredNames = new Set(requiredSkills.map(s => normalizeSkillName(s.name)));
  let relevantProjects = 0;

  for (const project of studentProjects) {
    if (project.skills && project.skills.some(s => requiredNames.has(normalizeSkillName(s)))) {
      relevantProjects++;
    }
  }
  return Math.min(relevantProjects * 25, 100);
}

export function calculateMatch(studentProfile, opportunity) {
  const skills = studentProfile.skills || [];
  const projects = studentProfile.projects || [];

  const skillMatch = calculateSkillMatch(skills, opportunity.requiredSkills);
  const expMatch = calculateExperienceMatch(
    studentProfile.experienceYears || 0,
    opportunity.experienceRequired
  );
  const workModeMatch = calculateWorkModeMatch(
    studentProfile.preferredWorkMode,
    opportunity.workMode
  );
  const locationMatch = calculateLocationMatch(
    studentProfile.preferredLocations,
    opportunity.location,
    opportunity.workMode
  );
  const projectMatch = calculateProjectEvidence(projects, opportunity.requiredSkills);

  // Weighted final score
  const finalScore = Math.round(
    skillMatch.score * 0.60 +
    expMatch * 0.15 +
    workModeMatch * 0.10 +
    locationMatch * 0.10 +
    projectMatch * 0.05
  );

  const reasons = [];
  if (skillMatch.matchedSkills.length > 0) {
    reasons.push(`You match ${skillMatch.matchedSkills.length} of ${(opportunity.requiredSkills || []).length} required skills.`);
  }
  if (skillMatch.missingSkills.length > 0) {
    reasons.push(`Missing skills: ${skillMatch.missingSkills.join(', ')}.`);
  }
  if (expMatch === 100) {
    reasons.push('Your experience level meets the requirements.');
  }
  if (workModeMatch === 100) {
    reasons.push('Work mode matches your preference.');
  }

  const nextActions = [];
  for (const missing of skillMatch.missingSkills) {
    nextActions.push(`Consider taking a challenge or building a project to demonstrate "${missing}" skills.`);
  }
  if (projectMatch < 50) {
    nextActions.push('Add relevant projects to your portfolio to strengthen your profile.');
  }

  return {
    score: Math.min(finalScore, 100),
    matchedSkills: skillMatch.matchedSkills,
    missingSkills: skillMatch.missingSkills,
    skillDetails: skillMatch.details,
    breakdown: {
      skills: skillMatch.score,
      experience: expMatch,
      workMode: workModeMatch,
      location: locationMatch,
      projectEvidence: projectMatch
    },
    reasons,
    nextActions
  };
}

export function rankOpportunities(studentProfile, opportunities) {
  return opportunities
    .map(opp => ({
      opportunity: opp,
      match: calculateMatch(studentProfile, opp)
    }))
    .sort((a, b) => b.match.score - a.match.score);
}

export function findComplementaryTeammates(projectSkills, candidateProfiles) {
  return candidateProfiles
    .map(profile => {
      const profileSkillNames = (profile.skills || []).map(s => normalizeSkillName(s.name));
      const projectSkillNorms = projectSkills.map(normalizeSkillName);
      const complementary = profileSkillNames.filter(s => projectSkillNorms.includes(s));
      const coverage = projectSkillNorms.length > 0
        ? Math.round((complementary.length / projectSkillNorms.length) * 100)
        : 0;
      return {
        profile,
        complementarySkills: complementary,
        coverageScore: coverage
      };
    })
    .filter(r => r.coverageScore > 0)
    .sort((a, b) => b.coverageScore - a.coverageScore);
}
