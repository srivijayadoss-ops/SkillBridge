import React from 'react';
import SkillTag from './SkillTag';
import { Trophy, Award } from 'lucide-react';

export default function ChallengeCard({ challenge, onSubmitClick }) {
  const {
    _id,
    title,
    description,
    difficulty,
    rewardXp = 250,
    prizePool,
    requiredSkills = [],
    submissionsCount = 0
  } = challenge;

  const diffColors = {
    beginner: { badge: 'badge-emerald', label: 'Beginner' },
    intermediate: { badge: 'badge-cyan', label: 'Intermediate' },
    advanced: { badge: 'badge-amber', label: 'Advanced' }
  };
  const diffInfo = diffColors[difficulty?.toLowerCase()] || { badge: 'badge-gray', label: difficulty || 'General' };

  return (
    <div className="glass-card" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.25rem',
      backgroundColor: '#ffffff'
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem'
        }}>
          <span className={`badge ${diffInfo.badge}`}>
            {diffInfo.label}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#b45309',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '0.775rem'
          }}>
            <Trophy size={13} />
            <span>+{rewardXp} XP</span>
            {prizePool && <span style={{ color: '#047857', marginLeft: '0.25rem' }}>· {prizePool}</span>}
          </div>
        </div>

        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          marginBottom: '0.45rem',
          color: '#0f172a',
          lineHeight: '1.3'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: '#64748b',
          lineHeight: '1.5',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
          {requiredSkills.slice(0, 4).map((skill, idx) => (
            <SkillTag key={idx} name={skill} />
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{
          fontSize: '0.785rem',
          color: '#94a3b8'
        }}>
          <span>{submissionsCount} student submissions</span>
        </div>

        <button
          onClick={() => onSubmitClick && onSubmitClick(challenge)}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Award size={13} color="#2563eb" />
          <span>Solve Challenge</span>
        </button>
      </div>
    </div>
  );
}
