import React from 'react';
import { Link } from 'react-router-dom';
import MatchScoreBadge from './MatchScoreBadge';
import SkillTag from './SkillTag';
import { 
  Building2, 
  MapPin, 
  Banknote, 
  Clock, 
  Bookmark, 
  ArrowRight
} from 'lucide-react';

export default function OpportunityCard({ 
  opportunity, 
  isSaved, 
  onToggleSave, 
  onApply,
  userSkills = [],
  isApplied = false,
  applicationStatus = null
}) {
  const {
    _id,
    title,
    recruiter,
    company,
    type,
    location,
    isRemote,
    stipend,
    requiredSkills = [],
    deadline,
    matchScore
  } = opportunity;

  const companyName = recruiter?.companyName || company || 'Partner Org';

  // Format currency/stipend
  const stipendText = stipend?.isUnpaid 
    ? 'Unpaid / Experience' 
    : stipend?.amount 
      ? `${stipend.currency || '₹'}${stipend.amount.toLocaleString()}${stipend.frequency === 'hourly' ? '/hr' : stipend.frequency === 'lump-sum' ? ' total' : '/mo'}`
      : 'Competitive';

  // Type badge styling
  const typeMap = {
    internship: { label: 'Internship', badge: 'badge-indigo' },
    project: { label: 'Live Project', badge: 'badge-cyan' },
    freelance: { label: 'Freelance', badge: 'badge-emerald' },
    research: { label: 'Research', badge: 'badge-amber' },
    mentorship: { label: 'Mentorship', badge: 'badge-rose' }
  };
  const typeInfo = typeMap[type] || { label: type, badge: 'badge-gray' };

  // Format deadline
  const deadlineStr = deadline ? new Date(deadline).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  }) : null;

  return (
    <div className="glass-card" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.25rem',
      backgroundColor: '#ffffff'
    }}>
      {/* Top row: Type, Remote, Match Score & Bookmark */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className={`badge ${typeInfo.badge}`}>
              {typeInfo.label}
            </span>
            {isRemote && (
              <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={11} /> Remote
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {matchScore !== undefined && matchScore !== null && (
              <MatchScoreBadge score={matchScore} size="sm" />
            )}
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave(_id);
                }}
                style={{
                  backgroundColor: isSaved ? '#eff6ff' : '#ffffff',
                  border: isSaved ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  color: isSaved ? '#2563eb' : '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
                title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
              >
                <Bookmark size={14} fill={isSaved ? '#2563eb' : 'none'} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Company */}
        <Link to={`/opportunities/${_id}`}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.35rem',
            lineHeight: '1.3'
          }}>
            {title}
          </h3>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.85rem',
          marginBottom: '1rem'
        }}>
          <Building2 size={14} color="#94a3b8" />
          <span style={{ fontWeight: '500' }}>{companyName}</span>
          {!isRemote && location && (
            <>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={12} /> {location}
              </span>
            </>
          )}
        </div>

        {/* Required Skills Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {requiredSkills.slice(0, 4).map((skill, idx) => {
            const skillName = typeof skill === 'string' ? skill : (skill.name || '');
            const hasSkill = userSkills.some(s => s.toLowerCase() === skillName.toLowerCase());
            return (
              <SkillTag 
                key={idx} 
                name={skillName} 
                matched={userSkills.length > 0 && hasSkill}
              />
            );
          })}
          {requiredSkills.length > 4 && (
            <span style={{ fontSize: '0.725rem', color: '#94a3b8', alignSelf: 'center', fontWeight: '500' }}>
              +{requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: Compensation, Deadline, and Actions */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{
            fontSize: '0.925rem',
            fontWeight: '700',
            color: '#047857',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Banknote size={15} />
            <span>{stipendText}</span>
          </div>
          {deadlineStr && (
            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.15rem'
            }}>
              <Clock size={11} />
              <span>Apply by {deadlineStr}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onApply && (
            isApplied ? (
              <button
                disabled
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#047857',
                  backgroundColor: '#ecfdf5',
                  borderColor: '#a7f3d0',
                  cursor: 'not-allowed',
                  opacity: 0.9
                }}
                title={`Already submitted (${applicationStatus || 'Applied'})`}
              >
                <span>✓ Applied</span>
              </button>
            ) : (
              <button
                onClick={() => onApply(opportunity)}
                className="btn btn-primary btn-sm"
              >
                <span>Apply</span>
              </button>
            )
          )}
          <Link
            to={`/opportunities/${_id}`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.6rem' }}
            title="View Details"
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
