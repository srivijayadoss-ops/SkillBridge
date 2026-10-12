import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MatchScoreBadge({ score, size = 'md' }) {
  if (score === undefined || score === null) return null;

  const num = Math.round(Number(score));
  
  let bg = '#fffbeb';
  let border = '#fde68a';
  let text = '#b45309';
  let label = 'Partial Match';
  let Icon = AlertCircle;

  if (num >= 80) {
    bg = '#ecfdf5';
    border = '#a7f3d0';
    text = '#047857';
    label = 'Strong Match';
    Icon = CheckCircle2;
  } else if (num >= 60) {
    bg = '#eff6ff';
    border = '#bfdbfe';
    text = '#1d4ed8';
    label = 'Good Match';
    Icon = Sparkles;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.25rem' : '0.4rem',
        padding: isSmall ? '0.15rem 0.5rem' : isLarge ? '0.35rem 0.85rem' : '0.25rem 0.65rem',
        borderRadius: '9999px',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: text,
        fontWeight: '600',
        fontSize: isSmall ? '0.725rem' : isLarge ? '0.9rem' : '0.785rem',
        lineHeight: '1.2'
      }}
      title={`AI Match Score: ${num}%`}
    >
      <Icon size={isSmall ? 12 : isLarge ? 15 : 13} />
      <span>{num}%</span>
      {!isSmall && <span style={{ opacity: 0.85, fontWeight: '500' }}>· {label}</span>}
    </div>
  );
}
