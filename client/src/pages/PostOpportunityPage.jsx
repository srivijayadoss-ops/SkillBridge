import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostOpportunityPage() {
  const { user, profile, showToast } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('internship');
  const [location, setLocation] = useState('Bangalore / Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [stipendAmount, setStipendAmount] = useState('25000');
  const [currency, setCurrency] = useState('₹');
  const [frequency, setFrequency] = useState('monthly');
  const [isUnpaid, setIsUnpaid] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState('React, Node.js, MongoDB');
  const [preferredSkills, setPreferredSkills] = useState('Docker, TailwindCSS');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-11-30');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Please fill in title and job description.');
      return;
    }

    setSubmitting(true);
    try {
      const reqSkillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const prefSkillsArray = preferredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        title,
        type,
        location,
        isRemote,
        stipend: {
          amount: isUnpaid ? 0 : parseInt(stipendAmount, 10) || 0,
          currency,
          frequency,
          isUnpaid
        },
        requiredSkills: reqSkillsArray,
        preferredSkills: prefSkillsArray,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : null
      };

      await api.opportunities.create(payload);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('Opportunity published to student network!', 'success');
      navigate('/recruiter-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: '2.25rem 2rem'
      }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-cyan">Talent Requisition</span>
            <span className="badge badge-emerald">Direct Match</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            Post a New Opportunity
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Publish an internship, project, or contract to verified student builders.
          </p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="input-label">Opportunity Title *</label>
            <input
              type="text"
              required
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Engineering Intern (LLM Agents)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <div>
              <label className="input-label">Opportunity Type</label>
              <select
                className="input-field"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="internship">Internship</option>
                <option value="project">Live Project / Contract</option>
                <option value="freelance">Freelance Gig</option>
                <option value="research">Research Lab</option>
                <option value="mentorship">Mentorship</option>
              </select>
            </div>

            <div>
              <label className="input-label">Location</label>
              <input
                type="text"
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore / Remote"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="remoteCheck"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              style={{ accentColor: '#2563eb', width: '1rem', height: '1rem' }}
            />
            <label htmlFor="remoteCheck" style={{ fontSize: '0.875rem', color: '#475569', cursor: 'pointer', fontWeight: '500' }}>
              Remote friendly (open to nationwide applicants)
            </label>
          </div>

          {/* Compensation Section */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
              Stipend / Compensation
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div>
                <label className="input-label">Currency</label>
                <input
                  type="text"
                  className="input-field"
                  disabled={isUnpaid}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Amount</label>
                <input
                  type="number"
                  className="input-field"
                  disabled={isUnpaid}
                  value={stipendAmount}
                  onChange={(e) => setStipendAmount(e.target.value)}
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="input-label">Frequency</label>
                <select
                  className="input-field"
                  disabled={isUnpaid}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="monthly">Per Month</option>
                  <option value="hourly">Hourly</option>
                  <option value="lump-sum">Lump-Sum (Fixed Project)</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.825rem', color: '#64748b' }}>
              <input
                type="checkbox"
                checked={isUnpaid}
                onChange={(e) => setIsUnpaid(e.target.checked)}
                style={{ accentColor: '#2563eb' }}
              />
              <span>Unpaid / Certificate & Experience Only</span>
            </label>
          </div>

          {/* Skills Required */}
          <div>
            <label className="input-label">Required Skills (comma separated) *</label>
            <input
              type="text"
              required
              className="input-field"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. React, Node.js, GraphQL, PostgreSQL"
            />
          </div>

          <div>
            <label className="input-label">Preferred Skills (comma separated)</label>
            <input
              type="text"
              className="input-field"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              placeholder="e.g. Docker, AWS, TailwindCSS"
            />
          </div>

          <div>
            <label className="input-label">Job Description & Responsibilities *</label>
            <textarea
              required
              className="input-field"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the role responsibilities, what the intern will build, and mentorship provided..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate('/recruiter-dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <PlusCircle size={16} />
              <span>{submitting ? 'Publishing...' : 'Publish Opportunity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
