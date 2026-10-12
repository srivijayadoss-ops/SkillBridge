import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeSubmissionModal from '../components/ChallengeSubmissionModal';
import { 
  Code2, 
  Trophy, 
  Award,
  Sparkles
} from 'lucide-react';

export default function ChallengesPage() {
  const { user, profile } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [submittingChallenge, setSubmittingChallenge] = useState(null);

  const tracks = [
    { id: 'all', label: 'All Tracks' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend APIs' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'fullstack', label: 'Full Stack' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner (100-250 XP)' },
    { id: 'intermediate', label: 'Intermediate (250-500 XP)' },
    { id: 'advanced', label: 'Advanced (500+ XP)' }
  ];

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.challenges.list({
        track: selectedTrack === 'all' ? '' : selectedTrack,
        difficulty: selectedDifficulty === 'all' ? '' : selectedDifficulty
      });
      setChallenges(res.challenges || []);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [selectedTrack, selectedDifficulty]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-emerald">
            <Trophy size={12} /> Proof of Skill Engine
          </span>
          <span className="badge badge-indigo">
            <Sparkles size={12} /> Recruiter Visibility
          </span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.02em' }}>
          Micro-Challenges & Engineering Bounties
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.975rem', maxWidth: '680px' }}>
          Solve realistic engineering micro-tasks, submit your GitHub repositories, and build an indisputable verified proof-of-work portfolio.
        </p>
      </div>

      {/* Proof of Work Highlight Banner */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: '#eff6ff',
            width: '2.2rem',
            height: '2.2rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            flexShrink: 0
          }}>
            <Award size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.15rem' }}>
              Why Skills Beat Paper Resumes
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Top hiring partners review and interview candidates directly based on practical challenge XP.
            </p>
          </div>
        </div>

        {profile && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '0.45rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.825rem',
            color: '#b45309',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Trophy size={15} color="#d97706" />
            <span>Your XP: {profile.readinessScore ? profile.readinessScore * 10 : 350} XP</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          {/* Tracks */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {tracks.map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() => setSelectedTrack(tr.id)}
                className={`btn btn-sm ${selectedTrack === tr.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tr.label}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field"
              style={{ padding: '0.35rem 0.65rem', width: 'auto', fontSize: '0.825rem' }}
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#64748b' }}>Loading micro-challenges...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 1rem',
          textAlign: 'center'
        }}>
          <Code2 size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem', color: '#0f172a' }}>
            No challenges found for this track
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Try switching to 'All Tracks' or clearing difficulty filters.
          </p>
          <button onClick={() => { setSelectedTrack('all'); setSelectedDifficulty('all'); }} className="btn btn-secondary">
            View All Challenges
          </button>
        </div>
      ) : (
        <div className="grid-cols-3">
          {challenges.map((ch) => (
            <ChallengeCard
              key={ch._id}
              challenge={ch}
              onSubmitClick={(targetCh) => setSubmittingChallenge(targetCh)}
            />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {submittingChallenge && (
        <ChallengeSubmissionModal
          challenge={submittingChallenge}
          onClose={() => setSubmittingChallenge(null)}
          onSuccess={() => {
            loadChallenges();
          }}
        />
      )}
    </div>
  );
}
