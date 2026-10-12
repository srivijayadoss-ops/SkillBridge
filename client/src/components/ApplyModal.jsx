import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from './MatchScoreBadge';
import confetti from 'canvas-confetti';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function ApplyModal({ opportunity, onClose, onSuccess }) {
  const { user, profile, showToast } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `Hello ${opportunity.company || 'Hiring Team'},\n\nI am thrilled to apply for the ${opportunity.title} role! My background matches your required stack, and I would love the chance to contribute to your mission.`
  );
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolioUrl || profile?.githubUrl || '');
  const [availability, setAvailability] = useState('Immediate (20-40 hrs/wk)');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please log in as a student to apply.');
      return;
    }

    if (user.role !== 'student') {
      setError('Only registered student accounts can apply to opportunities.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.opportunities.apply(opportunity._id, {
        coverLetter,
        portfolioUrl,
        availability
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(`Application submitted for ${opportunity.title}!`, 'success');
      if (onSuccess) onSuccess(res?.application);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-indigo">Direct Application</span>
              {opportunity.matchScore && <MatchScoreBadge score={opportunity.matchScore} size="sm" />}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
              {opportunity.title}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Applying to <strong style={{ color: '#0f172a' }}>{opportunity.company || opportunity.recruiter?.companyName || 'Hiring Partner'}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
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
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label className="input-label">Why are you a great fit? (Cover note / Key achievements)</label>
            <textarea
              className="input-field"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              placeholder="Highlight relevant projects and skills..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Portfolio / GitHub Link</label>
              <input
                type="url"
                className="input-field"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="input-label">Availability / Hours</label>
              <input
                type="text"
                className="input-field"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Immediate (20 hrs/week)"
              />
            </div>
          </div>

          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <Sparkles size={16} color="#2563eb" />
            <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>
              Your verified skills, project portfolio, and readiness score are attached automatically.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Send size={14} />
              <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
