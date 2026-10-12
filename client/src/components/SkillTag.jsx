import React from 'react';
import { Check, CheckCircle2, CircleDashed } from 'lucide-react';

export default function SkillTag({ name, verified, matched, missing, level }) {
  let bg = '#f1f5f9';
  let border = '#e2e8f0';
  let color = '#334155';

  if (matched) {
    bg = '#ecfdf5';
    border = '#a7f3d0';
    color = '#047857';
  } else if (missing) {
    bg = '#fff1f2';
    border = '#fecdd3';
    color = '#be123c';
  } else if (verified) {
    bg = '#eff6ff';
    border = '#bfdbfe';
    color = '#1d4ed8';
  }

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.55rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: color,
        whiteSpace: 'nowrap'
      }}
    >
      {verified && <CheckCircle2 size={11} color="#2563eb" />}
      {matched && <Check size={11} color="#059669" />}
      {missing && <CircleDashed size={11} color="#e11d48" />}
      <span>{name}</span>
      {level && (
        <span style={{ fontSize: '0.675rem', opacity: 0.75 }}>
          ({level})
        </span>
      )}
    </span>
  );
}
