import React, { useState } from 'react';
import { api } from '../api/client';
import { Sparkles, X, Brain } from 'lucide-react';

export default function AIModal({ type = 'gap', initialData = {}, onClose }) {
  const [targetRole, setTargetRole] = useState(initialData.targetRole || 'Full Stack Developer');
  const [resumeText, setResumeText] = useState(initialData.resumeText || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRunAI = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (type === 'gap') {
        const res = await api.ai.gapAnalysis(targetRole);
        setResult(res.analysis || res);
      } else if (type === 'resume') {
        const res = await api.ai.resumeReview({ resumeText });
        setResult(res.review || res);
      }
    } catch (err) {
      setError(err.message || 'AI service is temporarily busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '2.2rem',
              height: '2.2rem',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}>
              <Brain size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                {type === 'gap' ? 'AI Skill Gap & Career Roadmap' : 'AI Resume Optimization & ATS Review'}
              </h2>
              <p style={{ fontSize: '0.785rem', color: '#64748b' }}>
                Google Gemini 1.5 Flash Analytics
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
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
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Input section */}
        {!result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {type === 'gap' ? (
              <div>
                <label className="input-label">Select or Type Target Career Role:</label>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {['Full Stack Developer', 'AI / ML Engineer', 'Frontend Specialist', 'DevOps / Cloud Engineer', 'Data Analyst'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTargetRole(r)}
                      className={`btn btn-sm ${targetRole === r ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="input-field"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Distributed Systems Engineer"
                />
              </div>
            ) : (
              <div>
                <label className="input-label">Paste Your Resume Content / Project Summaries:</label>
                <textarea
                  className="input-field"
                  rows={6}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your education, skills, project bullet points, or past work experience here..."
                />
              </div>
            )}

            <button
              onClick={handleRunAI}
              disabled={loading}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Sparkles size={15} />
              <span>{loading ? 'AI Agent Analyzing...' : 'Generate AI Insights'}</span>
            </button>
          </div>
        )}

        {/* Loading animation */}
        {loading && (
          <div style={{
            padding: '2.5rem 1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              border: '3px solid #e2e8f0',
              borderTopColor: '#2563eb',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Analyzing profile skills against market job taxonomy...
            </p>
          </div>
        )}

        {/* Results display */}
        {result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {type === 'gap' ? (
              <>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.15rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Target Role</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>{result.targetRole || targetRole}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Role Readiness</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857' }}>
                      {result.readinessScore || '78'}%
                    </div>
                  </div>
                </div>

                {/* Missing skills */}
                {result.missingSkills && result.missingSkills.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: '#be123c' }}>
                      Priority Missing Skills:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {result.missingSkills.map((s, i) => (
                        <span key={i} className="badge badge-rose">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended roadmap */}
                {result.recommendedSteps && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.65rem', color: '#0f172a' }}>
                      Recommended 4-Week Action Roadmap:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.recommendedSteps.map((step, idx) => (
                        <div key={idx} style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem'
                        }}>
                          <span style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            width: '1.35rem',
                            height: '1.35rem',
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
                          <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Resume review results */
              <>
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '1.15rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#065f46' }}>ATS Resume Quality Score</h3>
                    <p style={{ fontSize: '0.8rem', color: '#047857' }}>Technical depth & clarity assessment</p>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#047857' }}>
                    {result.score || 82}/100
                  </div>
                </div>

                {result.strengths && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#047857', marginBottom: '0.4rem' }}>Key Strengths:</h4>
                    <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {result.strengths.map((st, i) => <li key={i}>{st}</li>)}
                    </ul>
                  </div>
                )}

                {result.improvements && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b45309', marginBottom: '0.4rem' }}>Recommended Improvements:</h4>
                    <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {result.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
              <button onClick={() => setResult(null)} className="btn btn-secondary">
                Analyze Another
              </button>
              <button onClick={onClose} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
