import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';
import ApplyModal from '../components/ApplyModal';
import AIModal from '../components/AIModal';
import { 
  Building2, 
  MapPin, 
  Banknote, 
  ArrowLeft, 
  Send, 
  Bookmark, 
  Sparkles, 
  Share2
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user, profile, showToast } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [application, setApplication] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showGapModal, setShowGapModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.opportunities.getById(id)
      .then((res) => {
        setOpportunity(res.opportunity || null);
        if (res.isSaved !== undefined) setIsSaved(res.isSaved);
        if (res.isApplied !== undefined) setIsApplied(res.isApplied);
        if (res.application) setApplication(res.application);
      })
      .catch((err) => {
        console.error('Failed to load opportunity:', err);
      })
      .finally(() => setLoading(false));

    if (user && user.role === 'student') {
      api.applications.listMy().then((appRes) => {
        const found = (appRes.applications || []).find(
          (a) => (a.opportunity?._id || a.opportunity)?.toString() === id
        );
        if (found) {
          setIsApplied(true);
          setApplication(found);
        }
      }).catch(() => {});
    }
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      showToast('Please log in to bookmark opportunities.', 'info');
      return;
    }
    try {
      if (isSaved) {
        await api.user.unsaveOpportunity(id);
        setIsSaved(false);
        showToast('Removed from saved opportunities', 'info');
      } else {
        await api.user.saveOpportunity(id);
        setIsSaved(true);
        showToast('Saved to your bookmarks!', 'success');
      }
    } catch (err) {
      showToast('Could not update saved status.', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity?.title,
        text: `Check out this ${opportunity?.title} role on SkillBridge!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#64748b' }}>Loading opportunity details...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
          Opportunity Not Found
        </h2>
        <Link to="/opportunities" className="btn btn-primary">
          Back to Opportunities
        </Link>
      </div>
    );
  }

  const userSkills = profile?.skills?.map((s) => s.name.toLowerCase()) || [];
  const required = opportunity.requiredSkills || [];
  const matchedSkills = required.filter((s) => userSkills.includes(s.toLowerCase()));
  const missingSkills = required.filter((s) => !userSkills.includes(s.toLowerCase()));

  const stipendText = opportunity.stipend?.isUnpaid 
    ? 'Unpaid / Certificate & Experience' 
    : opportunity.stipend?.amount 
      ? `${opportunity.stipend.currency || '₹'}${opportunity.stipend.amount.toLocaleString()}${opportunity.stipend.frequency === 'hourly' ? '/hr' : opportunity.stipend.frequency === 'lump-sum' ? ' total' : '/mo'}`
      : 'Competitive Compensation';

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Back button */}
      <Link to="/opportunities" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: '#64748b',
        fontSize: '0.875rem',
        marginBottom: '1.75rem',
        fontWeight: '500',
        transition: 'color 0.15s'
      }}>
        <ArrowLeft size={15} /> Back to all opportunities
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Main Content Column */}
        <div>
          {/* Header Card */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span className="badge badge-indigo" style={{ textTransform: 'capitalize' }}>
                {opportunity.type}
              </span>
              {opportunity.isRemote && (
                <span className="badge badge-gray">Remote Friendly</span>
              )}
              {opportunity.matchScore && (
                <MatchScoreBadge score={opportunity.matchScore} size="md" />
              )}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: '850', color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.25' }}>
              {opportunity.title}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#64748b',
              fontSize: '0.9rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0f172a', fontWeight: '600' }}>
                <Building2 size={16} color="#2563eb" />
                {opportunity.recruiter?.companyName || opportunity.company || 'Hiring Partner'}
              </span>
              {opportunity.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} /> {opportunity.location}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#047857', fontWeight: '700' }}>
                <Banknote size={16} /> {stipendText}
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              {isApplied ? (
                <button
                  disabled
                  className="btn btn-secondary btn-lg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#047857',
                    backgroundColor: '#ecfdf5',
                    borderColor: '#a7f3d0',
                    cursor: 'not-allowed',
                    opacity: 0.95
                  }}
                  title={`Application status: ${application?.status || 'Submitted'}`}
                >
                  <Send size={16} color="#059669" />
                  <span>✓ Applied ({application?.status ? application.status.toUpperCase() : 'SUBMITTED'})</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>Apply for this Role</span>
                </button>
              )}

              <button
                onClick={handleToggleSave}
                className="btn btn-secondary btn-lg"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Bookmark size={16} fill={isSaved ? '#2563eb' : 'none'} color={isSaved ? '#2563eb' : 'currentColor'} />
                <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="btn btn-secondary btn-lg"
                title="Share"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.85rem' }}>
              Role Overview & Responsibilities
            </h3>
            <div style={{
              color: '#334155',
              fontSize: '0.925rem',
              lineHeight: '1.7',
              whiteSpace: 'pre-line'
            }}>
              {opportunity.description}
            </div>
          </div>

          {/* Skills Requirements */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              Required Skill Stack
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.45rem' }}>
                Essential Skills:
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {opportunity.requiredSkills?.map((skill, i) => (
                  <SkillTag
                    key={i}
                    name={skill}
                    matched={userSkills.includes(skill.toLowerCase())}
                    missing={userSkills.length > 0 && !userSkills.includes(skill.toLowerCase())}
                  />
                ))}
              </div>
            </div>

            {opportunity.preferredSkills?.length > 0 && (
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '0.45rem' }}>
                  Nice-to-Have Skills:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {opportunity.preferredSkills.map((skill, i) => (
                    <SkillTag key={i} name={skill} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: AI Match Breakdown & Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Match Breakdown Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Sparkles size={16} color="#2563eb" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                AI Semantic Match
              </h4>
            </div>

            {opportunity.matchScore ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>Calculated Fit</span>
                  <MatchScoreBadge score={opportunity.matchScore} size="lg" />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.785rem', color: '#047857', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                    Matched Skills ({matchedSkills.length}/{required.length}):
                  </span>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {matchedSkills.map((s, i) => (
                      <span key={i} className="badge badge-emerald">✓ {s}</span>
                    ))}
                  </div>
                </div>

                {missingSkills.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.785rem', color: '#be123c', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                      Recommended to Learn:
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {missingSkills.map((s, i) => (
                        <span key={i} className="badge badge-rose">△ {s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowGapModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Sparkles size={13} color="#2563eb" />
                  <span>Generate AI Bridging Roadmap</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Log in with a student profile to see your automated Gemini skill compatibility breakdown and gap analysis.
              </div>
            )}
          </div>

          {/* Quick Opportunity Details Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.85rem' }}>
              Quick Info
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Type</span>
                <span style={{ color: '#0f172a', fontWeight: '600', textTransform: 'capitalize' }}>{opportunity.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Location</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>{opportunity.isRemote ? 'Remote' : opportunity.location}</span>
              </div>
              {opportunity.deadline && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Deadline</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>Actively Reviewing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          opportunity={opportunity}
          onClose={() => setShowApplyModal(false)}
          onSuccess={(newApp) => {
            setIsApplied(true);
            setApplication(newApp || { status: 'submitted' });
            showToast('Application successfully submitted!', 'success');
          }}
        />
      )}

      {/* AI Gap Modal */}
      {showGapModal && (
        <AIModal
          type="gap"
          initialData={{ targetRole: opportunity.title }}
          onClose={() => setShowGapModal(false)}
        />
      )}
    </div>
  );
}
