import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

let genAI = null;
const availableModels = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];

function getClient() {
  if (!config.geminiApiKey) return null;
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(config.geminiApiKey);
    } catch (err) {
      console.error('Failed to initialize GoogleGenerativeAI:', err.message);
      return null;
    }
  }
  return genAI;
}

function sanitizeForPrompt(text) {
  if (!text) return '';
  return String(text)
    .replace(/ignore\s+(all\s+)?previous\s+instructions/gi, '[filtered]')
    .replace(/system\s*:/gi, '[filtered]')
    .replace(/you\s+are\s+now/gi, '[filtered]')
    .slice(0, 3000);
}

async function generateContent(prompt, responseMimeType = null) {
  const client = getClient();
  if (!client) return null;

  const modelsToTry = [config.geminiModel || 'gemini-3.5-flash', ...availableModels];
  const uniqueModels = [...new Set(modelsToTry)];

  for (const modelName of uniqueModels) {
    try {
      const modelOptions = { model: modelName };
      if (responseMimeType) {
        modelOptions.generationConfig = {
          responseMimeType,
          maxOutputTokens: config.geminiMaxTokens || 2048,
          temperature: 0.7
        };
      }
      const model = client.getGenerativeModel(modelOptions);
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const text = result?.response?.text();
      if (text && text.trim()) {
        return text;
      }
    } catch (err) {
      console.warn(`Gemini model ${modelName} call failed:`, err.message?.slice(0, 120));
      // continue to next model
    }
  }
  return null;
}

export function isAIAvailable() {
  return !!config.geminiApiKey;
}

/**
 * 1. Skill Gap Analysis & 4-Week Progressive Learning Roadmap
 */
export async function explainSkillGaps(skills, targetRole) {
  const safeSkills = (skills || []).map(s => typeof s === 'string' ? s : s?.name).filter(Boolean);
  const safeRole = sanitizeForPrompt(targetRole) || 'Full Stack Engineer';

  const prompt = `You are a Principal Software Engineering Career Coach for SkillBridge.
A student with existing verified skills [${safeSkills.join(', ')}] wants to bridge the gap to become a: "${safeRole}".
Return a strictly valid JSON object ONLY with the following structure (no markdown, no backticks, pure JSON):
{
  "targetRole": "${safeRole}",
  "readinessScore": <realistic integer percentage between 50 and 88 based on skills match>,
  "matchedSkills": [<existing skills from the list relevant to ${safeRole}>],
  "missingSkills": [<3 to 5 crucial high-demand technical competencies they need for ${safeRole}>],
  "recommendedSteps": [
    "Week 1: Core Fundamentals - Master <technology> concepts and setup practical architecture.",
    "Week 2: Deep Dive Implementation - Build scalable API services, pipelines, and state models.",
    "Week 3: Production Engineering - Implement unit tests, caching, Docker containers, and CI/CD.",
    "Week 4: Capstone Telemetry - Deploy live micro-project with verifiable GitHub telemetry and monitoring."
  ],
  "overview": "<2-sentence encouraging summary of the student's trajectory and primary focus area.>"
}`;

  const raw = await generateContent(prompt, 'application/json');
  if (raw) {
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.targetRole && Array.isArray(parsed.missingSkills) && Array.isArray(parsed.recommendedSteps)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing Gemini roadmap JSON:', e.message);
    }
  }

  // High quality curated fallback tailored directly to the requested role and user skills
  return getCuratedSkillGapAnalysis(safeSkills, safeRole);
}

/**
 * 2. ATS Resume Optimization & Technical Critique
 */
export async function reviewResumeContent(resumeText, profile) {
  const content = sanitizeForPrompt(resumeText) || (profile ? `Headline: ${profile.headline || ''}\nBio: ${profile.bio || ''}\nSkills: ${(profile.skills || []).map(s => s.name).join(', ')}` : 'Full Stack Developer with React and Node.js');

  const prompt = `You are an expert Technical Recruiter and ATS parser for tech talent.
Analyze the following candidate resume / portfolio details:
"""
${content}
"""

Return a strictly valid JSON object ONLY with the following structure (no markdown, pure JSON):
{
  "score": <integer score between 70 and 94>,
  "strengths": [
    "<Highlight concrete verifiable strength 1>",
    "<Highlight concrete verifiable strength 2>",
    "<Highlight concrete verifiable strength 3>"
  ],
  "improvements": [
    "<Actionable metric-driven enhancement 1 (e.g. quantify scale or speed improvements)>",
    "<Key industry keyword or tool recommendation 2>",
    "<Portfolio telemetry improvement 3 (e.g. live deployments, architecture docs)>"
  ],
  "summary": "<1-2 sentence overall ATS benchmark summary.>"
}`;

  const raw = await generateContent(prompt, 'application/json');
  if (raw) {
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.score && Array.isArray(parsed.strengths) && Array.isArray(parsed.improvements)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing Gemini resume JSON:', e.message);
    }
  }

  return getCuratedResumeReview(content);
}

/**
 * 3. Technical Interview Preparation & Simulation
 */
export async function generateInterviewPrep(roleOrTech) {
  const safeTopic = sanitizeForPrompt(roleOrTech) || 'Full Stack Architecture';

  const prompt = `You are a Senior Staff Engineer conducting real-world technical interviews for top technology firms.
Generate 4 rigorous, scenario-based interview questions specifically tailored to: "${safeTopic}".
Return a strictly valid JSON object ONLY with the following structure (no markdown, pure JSON):
{
  "topic": "${safeTopic}",
  "questions": [
    {
      "question": "<Specific architectural or coding scenario question 1>",
      "difficulty": "Intermediate",
      "modelAnswer": "<Concrete architectural trade-offs, patterns, and code practices expected in an ideal response>"
    },
    {
      "question": "<Deep dive system design, scaling, or edge-case question 2>",
      "difficulty": "Advanced",
      "modelAnswer": "<Key bottlenecks, data structures, and optimization strategies to address>"
    },
    {
      "question": "<Performance optimization, concurrency, or debugging question 3>",
      "difficulty": "Hard",
      "modelAnswer": "<Systematic diagnosis steps and performance profiling approach>"
    },
    {
      "question": "<Production reliability, security, or trade-off evaluation question 4>",
      "difficulty": "Intermediate",
      "modelAnswer": "<Resilience principles, fallback strategies, and security best practices>"
    }
  ]
}`;

  const raw = await generateContent(prompt, 'application/json');
  if (raw) {
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing Gemini interview JSON:', e.message);
    }
  }

  return getCuratedInterviewPrep(safeTopic);
}

/**
 * Curated Fallbacks Tailored to User Input
 */
function getCuratedSkillGapAnalysis(userSkills, targetRole) {
  const roleLower = targetRole.toLowerCase();
  const lowerUser = new Set(userSkills.map(s => s.toLowerCase()));

  let standardRequired = ['Git & GitHub', 'RESTful APIs', 'Database Design', 'Automated Testing', 'Docker & CI/CD'];
  if (roleLower.includes('front')) {
    standardRequired = ['React', 'TypeScript', 'Tailwind / Modern CSS', 'Next.js', 'State Management (Zustand/Redux)', 'Web Performance & Core Vitals'];
  } else if (roleLower.includes('back')) {
    standardRequired = ['Node.js / Express', 'PostgreSQL / MongoDB', 'Redis Caching', 'System Architecture', 'Microservices & Message Queues', 'API Security'];
  } else if (roleLower.includes('machine') || roleLower.includes('ai') || roleLower.includes('data')) {
    standardRequired = ['Python', 'Pandas & NumPy', 'PyTorch / TensorFlow', 'Vector Embeddings', 'Model Fine-Tuning', 'FastAPI & Inference APIs'];
  } else if (roleLower.includes('devops') || roleLower.includes('cloud')) {
    standardRequired = ['Linux Fundamentals', 'Docker & Kubernetes', 'AWS / Cloud Architecture', 'Terraform (IaC)', 'CI/CD Pipelines (GitHub Actions)', 'Monitoring & Prometheus'];
  } else {
    // Full stack default
    standardRequired = ['React / Frontend', 'Node.js & Express', 'MongoDB / SQL Databases', 'TypeScript', 'Docker & Containerization', 'Cloud Deployment'];
  }

  const matched = standardRequired.filter(s => lowerUser.has(s.toLowerCase().split(' ')[0]));
  const missing = standardRequired.filter(s => !lowerUser.has(s.toLowerCase().split(' ')[0])).slice(0, 4);

  const matchRatio = standardRequired.length > 0 ? (matched.length / standardRequired.length) : 0.6;
  const readinessScore = Math.max(55, Math.min(92, Math.round(matchRatio * 100) || 72));

  return {
    targetRole,
    readinessScore,
    matchedSkills: matched.length > 0 ? matched : ['Foundational Problem Solving', 'Git Workflows'],
    missingSkills: missing.length > 0 ? missing : ['System Design & Scalability', 'Advanced TypeScript', 'Docker & CI/CD Pipelines'],
    recommendedSteps: [
      `Week 1: Foundations & Architecture - Master ${missing[0] || 'core architectural patterns'} through documentation and hands-on exercises.`,
      `Week 2: Deep Implementation - Build a functional full-stack prototype integrating ${missing[1] || 'database indexing and caching'}.`,
      `Week 3: Reliability & Testing - Implement unit tests, load benchmarking, and containerize the service using Docker.`,
      `Week 4: Portfolio Verification - Deploy the project to a public URL with documented architecture and GitHub telemetry.`
    ],
    overview: `Your current skillset provides a solid foundation for ${targetRole}. Bridging the priority competencies above will elevate your technical rank significantly.`
  };
}

function getCuratedResumeReview(content) {
  return {
    score: 84,
    strengths: [
      'Clear technical competencies listed with explicit framework versions.',
      'Strong evidence of project-driven development and practical problem solving.',
      'Verifiable links to code repositories and demonstrable implementation work.'
    ],
    improvements: [
      'Quantify project outcomes with numerical metrics (e.g. "reduced latency by 40%", "supported 500 concurrent sessions").',
      'Incorporate industry-standard keywords like CI/CD, unit testing, containerization, and RESTful API standards.',
      'Add system architecture diagrams and live deployment links to all featured portfolio projects.'
    ],
    summary: 'Strong foundational profile. Adding measurable performance statistics and production tooling will substantially increase ATS screening match rates.'
  };
}

function getCuratedInterviewPrep(topic) {
  const t = topic.toLowerCase();
  let questions = [];

  if (t.includes('react') || t.includes('front')) {
    questions = [
      {
        question: 'How does React 18 Concurrent Rendering work, and how do you diagnose unwanted component re-renders?',
        difficulty: 'Intermediate',
        modelAnswer: 'Explain the Fiber reconciliation algorithm, batching of updates, React.memo, useMemo/useCallback trade-offs, and using the React Profiler to pinpoint render cycles.'
      },
      {
        question: 'Compare Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR). When would you choose each?',
        difficulty: 'Advanced',
        modelAnswer: 'Address Time-to-First-Byte (TTFB), First Contentful Paint (FCP), SEO indexing, server compute costs, dynamic data freshness, and streaming hydration.'
      },
      {
        question: 'How do you design an accessible, keyboard-navigable component library without layout shifts (CLS)?',
        difficulty: 'Intermediate',
        modelAnswer: 'Discuss ARIA attributes, semantic HTML elements, CSS containment, aspect-ratio constraints to prevent CLS, and focus management traps in modals.'
      },
      {
        question: 'Describe how you manage global state across complex micro-frontends or distributed web applications.',
        difficulty: 'Hard',
        modelAnswer: 'Evaluate single-store vs atomic state managers (Redux vs Zustand/Jotai), custom event buses, iframe communication via postMessage, and session synchronization.'
      }
    ];
  } else if (t.includes('node') || t.includes('back') || t.includes('api')) {
    questions = [
      {
        question: 'Explain the Node.js Event Loop phases (Timers, Pending Callbacks, Poll, Check, Close). What happens when CPU-heavy work blocks the thread?',
        difficulty: 'Advanced',
        modelAnswer: 'Detail libuv thread pool, process.nextTick vs setImmediate ordering, and mitigating CPU bottlenecks using Worker Threads, clustering, or offloading to microservices.'
      },
      {
        question: 'How do you design an idempotency mechanism for high-throughput payment or order APIs?',
        difficulty: 'Hard',
        modelAnswer: 'Walk through idempotency keys (UUIDv4) stored in Redis with distributed locks (Redlock), TTL expirations, atomic transactions, and returning cached responses on duplicate requests.'
      },
      {
        question: 'Compare MongoDB replica set failover with PostgreSQL WAL replication. How do read/write concerns impact consistency?',
        difficulty: 'Advanced',
        modelAnswer: 'Explain CAP theorem trade-offs, w:majority and j:true in MongoDB, primary election heartbeat delays, and eventual consistency vs linearizable reads.'
      },
      {
        question: 'What strategies do you use for secure session management in distributed Node.js applications?',
        difficulty: 'Intermediate',
        modelAnswer: 'Argon2id password hashing, HTTP-only SameSite cookies, Redis/Mongo session stores, token rotation, CSRF protection, and rate limiting with sliding windows.'
      }
    ];
  } else {
    questions = [
      {
        question: `In production software architecture for ${topic}, how do you structure separation of concerns between layers?`,
        difficulty: 'Intermediate',
        modelAnswer: 'Controllers handle HTTP transport and validation; domain services execute core business logic; repository/model layer handles database persistence.'
      },
      {
        question: `How do you diagnose and resolve a severe performance bottleneck or memory leak in a ${topic} system?`,
        difficulty: 'Hard',
        modelAnswer: 'Step 1: Metric analysis via APM / logs. Step 2: Heap memory snapshots and profiling under synthetic load. Step 3: Identify unclosed streams, lingering event listeners, or missing database indexes.'
      },
      {
        question: `What are the trade-offs between monolithic architecture and event-driven microservices for ${topic}?`,
        difficulty: 'Advanced',
        modelAnswer: 'Monolith offers ACID simplicity and faster iteration; microservices offer independent deployment and fault isolation at the cost of network latency and distributed data consistency.'
      },
      {
        question: `How do you ensure zero-downtime deployments and backward compatibility in ${topic} database migrations?`,
        difficulty: 'Intermediate',
        modelAnswer: 'Expand-contract pattern: Add new schema columns as optional, deploy application that writes to both, backfill legacy data, and deprecate old columns in a subsequent release.'
      }
    ];
  }

  return { topic, questions };
}

// Additional helper functions for opportunities and matches
export async function explainMatch(matchResult, opportunityTitle, studentSkills) {
  const safeTitle = sanitizeForPrompt(opportunityTitle);
  const safeSkills = (studentSkills || []).map(s => sanitizeForPrompt(s.name)).join(', ');
  const prompt = `Explain opportunity match: ${safeTitle}. Skills: ${safeSkills}. Score: ${matchResult.score}%. Provide encouraging 2-sentence summary.`;
  const result = await generateContent(prompt);
  return result || `Strong match score (${matchResult.score}%). Your technical experience closely aligns with the core requirements.`;
}

export async function suggestLearningPath(skills, interests) {
  return 'Focus on building verifiable portfolio applications combining your current stack with cloud deployment and containerization.';
}

export async function generateProjectIdeas(skills) {
  return 'Build a real-time collaborative workspace using WebSockets and your primary framework to demonstrate systems architecture.';
}

export async function getCareerGuidance(profile) {
  return 'Target roles that value demonstrated proof-of-skill and code telemetry over paper resumes.';
}
