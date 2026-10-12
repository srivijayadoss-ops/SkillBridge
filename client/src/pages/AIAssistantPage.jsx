import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Brain, 
  FileText, 
  Target, 
  HelpCircle, 
  AlertCircle,
  Zap
} from 'lucide-react';

export default function AIAssistantPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('gap'); // 'gap', 'resume', 'interview'

  // Gap Analysis State
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [gapResult, setGapResult] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);

  // Resume State
  const [resumeText, setResumeText] = useState(
    profile ? `${profile.headline || ''}\n${profile.bio || ''}\nSkills: ${(profile.skills || []).map(s => s.name).join(', ')}` : ''
  );
  const [resumeResult, setResumeResult] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Interview Prep State
  const [interviewTopic, setInterviewTopic] = useState('React & Frontend Architecture');
  const [interviewResult, setInterviewResult] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [error, setError] = useState('');

  const handleGapAnalysis = async () => {
    setError('');
    setGapLoading(true);
    setGapResult(null);
    try {
      const res = await api.ai.gapAnalysis(targetRole);
      setGapResult(res.analysis || res);
    } catch (err) {
      setError(err.message || 'AI service temporarily unavailable.');
    } finally {
      setGapLoading(false);
    }
  };

  const handleResumeReview = async () => {
    setError('');
    setResumeLoading(true);
    setResumeResult(null);
    try {
      const res = await api.ai.resumeReview({ resumeText });
      setResumeResult(res.review || res);
    } catch (err) {
      setError(err.message || 'AI service temporarily unavailable.');
    } finally {
      setResumeLoading(false);
    }
  };

  const handleInterviewPrep = async () => {
    setError('');
    setInterviewLoading(true);
    setInterviewResult(null);
    try {
      const res = await api.ai.interviewPrep(interviewTopic);
      setInterviewResult(res.prep || res);
    } catch (err) {
      setError(err.message || 'AI service temporarily unavailable.');
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '960px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-indigo">
            <Sparkles size={13} /> Gemini 1.5 Flash Analytics
          </span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          AI Career & Opportunity Coach
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
          Personalized skill bridging roadmaps, ATS resume optimization, and mock technical interview simulations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.4rem',
        backgroundColor: '#f1f5f9',
        padding: '0.35rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('gap')}
          className={`btn ${activeTab === 'gap' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'gap' ? '#ffffff' : 'transparent',
            color: activeTab === 'gap' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'gap' ? 'var(--shadow-xs)' : 'none'
          }}
        >
          <Target size={15} color={activeTab === 'gap' ? '#2563eb' : '#64748b'} />
          <span>Skill Gap Roadmap</span>
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`btn ${activeTab === 'resume' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'resume' ? '#ffffff' : 'transparent',
            color: activeTab === 'resume' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'resume' ? 'var(--shadow-xs)' : 'none'
          }}
        >
          <FileText size={15} color={activeTab === 'resume' ? '#2563eb' : '#64748b'} />
          <span>ATS Resume Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`btn ${activeTab === 'interview' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'interview' ? '#ffffff' : 'transparent',
            color: activeTab === 'interview' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'interview' ? 'var(--shadow-xs)' : 'none'
          }}
        >
          <HelpCircle size={15} color={activeTab === 'interview' ? '#2563eb' : '#64748b'} />
          <span>Interview Coach</span>
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#be123c',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: Skill Gap Roadmap */}
      {activeTab === 'gap' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
            Personalized Role Gap Analysis
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Identify precisely what technical competencies you need to bridge for your target role.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {['Full Stack Engineer', 'Machine Learning Engineer', 'DevOps & Cloud', 'Frontend Specialist'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`btn btn-sm ${targetRole === role ? 'btn-primary' : 'btn-secondary'}`}
              >
                {role}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-field"
              style={{ flex: '1 1 300px' }}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Distributed Systems Engineer"
            />
            <button
              onClick={handleGapAnalysis}
              disabled={gapLoading}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Sparkles size={15} />
              <span>{gapLoading ? 'Analyzing...' : 'Generate Roadmap'}</span>
            </button>
          </div>

          {gapLoading && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comparing skills against current tech job benchmarks...</p>
            </div>
          )}

          {gapResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Analyzed Role</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>{gapResult.targetRole || targetRole}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Estimated Match Fit</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#047857' }}>
                    {gapResult.readinessScore || 78}%
                  </div>
                </div>
              </div>

              {gapResult.overview && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  lineHeight: '1.5'
                }}>
                  {gapResult.overview}
                </div>
              )}

              {gapResult.missingSkills && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#be123c', marginBottom: '0.5rem' }}>
                    Priority Skills to Acquire:
                  </h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {gapResult.missingSkills.map((sk, i) => (
                      <span key={i} className="badge badge-rose" style={{ padding: '0.3rem 0.65rem' }}>
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gapResult.recommendedSteps && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.65rem' }}>
                    4-Week Progressive Learning Roadmap:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {gapResult.recommendedSteps.map((step, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem'
                      }}>
                        <span style={{
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          width: '1.4rem',
                          height: '1.4rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.45' }}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ATS Resume Audit */}
      {activeTab === 'resume' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
            ATS Resume Optimization & Critique
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Score your resume against technical talent benchmarks with actionable bullet rewrites.
          </p>

          <textarea
            className="input-field"
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your education, skills, project bullet points, or past work experience here..."
            style={{ marginBottom: '1rem' }}
          />

          <button
            onClick={handleResumeReview}
            disabled={resumeLoading || !resumeText.trim()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.5rem' }}
          >
            <Sparkles size={15} />
            <span>{resumeLoading ? 'Evaluating with Gemini...' : 'Analyze Resume'}</span>
          </button>

          {resumeLoading && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Scoring metrics, keywords, and structural clarity...</p>
            </div>
          )}

          {resumeResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#065f46' }}>ATS Impact Score</h4>
                  <p style={{ fontSize: '0.8rem', color: '#047857' }}>Evaluated across clarity, metrics, and keyword density</p>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#047857' }}>
                  {resumeResult.score || 84}/100
                </div>
              </div>

              {resumeResult.strengths && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#047857', marginBottom: '0.4rem' }}>Key Strengths:</h4>
                  <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {resumeResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {resumeResult.improvements && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#b45309', marginBottom: '0.4rem' }}>Actionable Enhancements:</h4>
                  <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {resumeResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Technical Interview Preparation */}
      {activeTab === 'interview' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
            Technical Interview Simulation
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Practice questions tailored to your tech stack with evaluation criteria.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              'React & Frontend Architecture',
              'Node.js & Backend Systems',
              'MongoDB & Database Design',
              'Distributed Systems & Microservices',
              'Full-Stack Web Security'
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setInterviewTopic(topic)}
                className={`btn btn-sm ${interviewTopic === topic ? 'btn-primary' : 'btn-secondary'}`}
              >
                {topic}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-field"
              style={{ flex: '1 1 300px' }}
              value={interviewTopic}
              onChange={(e) => setInterviewTopic(e.target.value)}
              placeholder="e.g. Node.js Event Loop, System Design, React Performance"
            />
            <button
              onClick={handleInterviewPrep}
              disabled={interviewLoading}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Zap size={15} />
              <span>{interviewLoading ? 'Generating...' : 'Start Session'}</span>
            </button>
          </div>

          {interviewLoading && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Formulating scenario-based interview questions...</p>
            </div>
          )}

          {interviewResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                Practice Questions for: <span style={{ color: '#2563eb' }}>{interviewTopic}</span>
              </div>

              {((interviewResult.questions || interviewResult) && Array.isArray(interviewResult.questions || interviewResult) 
                ? (interviewResult.questions || interviewResult) 
                : []).map((q, idx) => {
                const questionText = typeof q === 'string' ? q : (q.question || q.text || 'Technical Interview Question');
                const difficulty = typeof q === 'object' ? q.difficulty : null;
                const modelAnswer = typeof q === 'object' ? q.modelAnswer : null;

                return (
                  <div key={idx} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-indigo">Question {idx + 1}</span>
                      {difficulty && <span className="badge badge-gray">{difficulty}</span>}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.65rem' }}>
                      {questionText}
                    </h4>
                    {modelAnswer && (
                      <div style={{
                        backgroundColor: '#ffffff',
                        borderLeft: '3px solid #059669',
                        border: '1px solid #e2e8f0',
                        borderLeftWidth: '3px',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: '#334155',
                        lineHeight: '1.5'
                      }}>
                        <strong style={{ color: '#047857', display: 'block', marginBottom: '0.2rem' }}>Key Concepts to Cover:</strong>
                        {modelAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
