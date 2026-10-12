import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Code, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function ChallengeSubmissionModal({ challenge, onClose, onSuccess }) {
  const { user, profile, showToast } = useAuth();
  const [challengeData, setChallengeData] = useState(challenge);
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  
  // Answers state: { [questionId]: selectedAnswer }
  const [answers, setAnswers] = useState({});
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showOptionalRepo, setShowOptionalRepo] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Load complete challenge details if questions aren't present
  useEffect(() => {
    if (challenge && (!challenge.questions || challenge.questions.length === 0)) {
      setLoadingChallenge(true);
      api.challenges.getById(challenge._id)
        .then(res => {
          if (res.challenge) {
            setChallengeData(res.challenge);
          }
        })
        .catch(err => {
          console.error('Error fetching challenge details:', err);
        })
        .finally(() => {
          setLoadingChallenge(false);
        });
    }
  }, [challenge]);

  if (!challengeData) return null;

  const questions = challengeData.questions || [];
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = questions.length > 0 && answeredCount >= questions.length;

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please sign in as a student to submit challenges.');
      return;
    }

    if (questions.length > 0 && answeredCount < questions.length) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    setSubmitting(true);
    try {
      const res = await api.challenges.submit(challengeData._id, {
        answers: formattedAnswers,
        githubUrl: githubUrl.trim() || undefined,
        notes: notes.trim() || undefined
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setResult(res);
      showToast(res.message || 'Challenge completed successfully!', 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit challenge solution.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          borderRadius: '16px'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-indigo">
                <Code size={12} /> {challengeData.skill || 'Coding Challenge'}
              </span>
              <span className="badge badge-emerald">
                {challengeData.difficulty || 'Intermediate'}
              </span>
              <span className="badge badge-amber">
                <Trophy size={12} /> +{challengeData.rewardXp || challengeData.totalPoints || 250} XP
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
              {challengeData.title}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '600px' }}>
              {challengeData.description}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.35rem' }}>
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
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {loadingChallenge ? (
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
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading challenge questions...</p>
            </div>
          ) : result ? (
            /* Results & Telemetry Screen */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
              <div style={{
                backgroundColor: result.passed ? '#ecfdf5' : '#f8fafc',
                border: `1px solid ${result.passed ? '#a7f3d0' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: result.passed ? '#d1fae5' : '#eff6ff',
                  color: result.passed ? '#059669' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Trophy size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: result.passed ? '#065f46' : '#0f172a', marginBottom: '0.35rem' }}>
                  {result.passed ? 'Challenge Passed & Verified!' : 'Challenge Completed!'}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {result.message}
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  backgroundColor: '#ffffff',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '9999px',
                  boxShadow: 'var(--shadow-xs)',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Score</span>
                    <strong style={{ fontSize: '1.25rem', color: '#047857' }}>{result.percentage}%</strong>
                  </div>
                  <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Points</span>
                    <strong style={{ fontSize: '1.25rem', color: '#2563eb' }}>{result.score} / {result.maxScore}</strong>
                  </div>
                  <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>XP Earned</span>
                    <strong style={{ fontSize: '1.25rem', color: '#d97706' }}>+{result.rewardXp} XP</strong>
                  </div>
                </div>
              </div>

              {/* Question breakdown */}
              {result.gradedAnswers && result.gradedAnswers.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                    Evaluation Breakdown:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {result.gradedAnswers.map((ga, idx) => {
                      const origQ = questions.find(q => q._id === ga.questionId || q._id.toString() === ga.questionId?.toString());
                      return (
                        <div 
                          key={idx}
                          style={{
                            backgroundColor: ga.isCorrect ? '#f0fdf4' : '#fff1f2',
                            border: `1px solid ${ga.isCorrect ? '#bbf7d0' : '#fecdd3'}`,
                            borderRadius: '8px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                            {ga.isCorrect ? (
                              <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                            ) : (
                              <XCircle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                            )}
                            <div>
                              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.2rem' }}>
                                Question {idx + 1}: {origQ?.text || 'Challenge Question'}
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                                Your answer: <span style={{ fontWeight: '600' }}>{ga.answer || 'None'}</span>
                              </p>
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: '700',
                            color: ga.isCorrect ? '#16a34a' : '#e11d48',
                            flexShrink: 0
                          }}>
                            {ga.isCorrect ? `+${ga.pointsEarned} pts` : '0 pts'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Active Challenge Solving Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Question Count & Progress Banner */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
                  <HelpCircle size={15} color="#2563eb" />
                  <span>Technical Assessment: {questions.length} Questions</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: isAllAnswered ? '#059669' : '#64748b', fontWeight: '600' }}>
                  {answeredCount} of {questions.length} answered {isAllAnswered && '✓'}
                </div>
              </div>

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {questions.map((q, qIndex) => {
                  const selectedVal = answers[q._id];
                  return (
                    <div 
                      key={q._id || qIndex}
                      style={{
                        backgroundColor: '#ffffff',
                        border: selectedVal ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1.15rem',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          color: '#2563eb', 
                          backgroundColor: '#eff6ff', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px' 
                        }}>
                          Question {qIndex + 1}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                          {q.points || 10} pts
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.975rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.85rem', lineHeight: '1.4' }}>
                        {q.text}
                      </h4>

                      {/* Options */}
                      {q.options && q.options.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {q.options.map((opt, optIndex) => {
                            const isSelected = selectedVal === opt;
                            const optionLetters = ['A', 'B', 'C', 'D', 'E'];
                            return (
                              <button
                                type="button"
                                key={optIndex}
                                onClick={() => handleSelectOption(q._id, opt)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.65rem',
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: '8px',
                                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                                  color: isSelected ? '#1e40af' : '#334155',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'all 0.15s ease',
                                  outline: 'none'
                                }}
                              >
                                <span style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                                  color: isSelected ? '#ffffff' : '#64748b',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {optionLetters[optIndex] || optIndex + 1}
                                </span>
                                <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? '600' : '400', flex: 1 }}>
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        /* Text/Code answer input if no choices */
                        <div>
                          <textarea
                            className="input-field"
                            rows={3}
                            value={selectedVal || ''}
                            onChange={(e) => handleSelectOption(q._id, e.target.value)}
                            placeholder="Type your code solution or answer explanation..."
                            style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Optional GitHub Repo & Notes toggle */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowOptionalRepo(!showOptionalRepo)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: 0
                  }}
                >
                  <Code size={14} />
                  <span>{showOptionalRepo ? '− Hide Optional Proof of Work (GitHub Link)' : '+ Add Optional Proof of Work (GitHub Link / Notes)'}</span>
                </button>

                {showOptionalRepo && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label className="input-label">GitHub Repository URL (Optional)</label>
                      <input
                        type="url"
                        className="input-field"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/your-username/challenge-repo"
                      />
                    </div>
                    <div>
                      <label className="input-label">Implementation Notes (Optional)</label>
                      <textarea
                        className="input-field"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Key architectural choices, edge cases handled, or optimization notes..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.25rem',
          marginTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {result ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Complete & Back to Challenges</span>
                <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || (questions.length > 0 && !isAllAnswered)}
                className="btn btn-emerald"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Award size={16} />
                <span>{submitting ? 'Evaluating Answers...' : 'Submit Answers & Claim XP'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
