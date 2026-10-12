import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function RecruiterDashboard() {
  const { user, profile, showToast } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await api.recruiter.getDashboard();
        const opps = res.opportunities || [];
        setOpportunities(opps);
        if (opps.length > 0) {
          setSelectedOppId(opps[0]._id);
        }
      } catch (err) {
        console.error('Failed to load recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedOppId) return;
    api.applications.listForOpportunity(selectedOppId)
      .then((res) => {
        setApplications(res.applications || []);
      })
      .catch((err) => {
        console.error('Failed to load applications for opportunity:', err);
      });
  }, [selectedOppId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingAppId(appId);
    try {
      await api.applications.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
      showToast(`Candidate status updated to "${newStatus.toUpperCase()}"`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingAppId(null);
    }
  };

  const totalApplicants = opportunities.reduce((acc, curr) => acc + (curr.applicantCount ?? curr.applicantsCount ?? 0), 0);
  const selectedOpp = opportunities.find((o) => o._id === selectedOppId);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-cyan">Talent Operations</span>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> Verified Hiring Partner
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
              {profile?.companyName || user?.name}'s Candidate Pipeline
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Review candidates by verified skill telemetry, code proof, and semantic match rank.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link
              to="/students"
              className="btn btn-secondary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Users size={16} />
              <span>Student Directory</span>
            </Link>

            <Link
              to="/post-opportunity"
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <PlusCircle size={16} />
              <span>Post New Opportunity</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Active Openings</span>
            <Briefcase size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            {opportunities.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Total Applicants</span>
            <Users size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#047857' }}>
            {totalApplicants}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>In Review</span>
            <CheckCircle2 size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0284c7' }}>
            {applications.filter(a => a.status !== 'applied').length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Avg Match Fit</span>
            <Sparkles size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#b45309' }}>
            88%
          </div>
        </div>
      </div>

      {/* Main Pipeline Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 2.5fr)',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Left: Role Selection List */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.85rem' }}>
            Active Openings
          </h3>

          {opportunities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b' }}>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>No opportunities posted yet.</p>
              <Link to="/post-opportunity" className="btn btn-primary btn-sm">
                Create First Opening
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {opportunities.map((opp) => {
                const isSelected = opp._id === selectedOppId;
                return (
                  <button
                    key={opp._id}
                    onClick={() => setSelectedOppId(opp._id)}
                    style={{
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      color: 'inherit'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.875rem', color: isSelected ? '#1e40af' : '#0f172a', marginBottom: '0.15rem' }}>
                      {opp.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ textTransform: 'capitalize' }}>{opp.type}</span>
                      <span style={{ color: (opp.applicantCount ?? opp.applicantsCount ?? 0) > 0 ? '#047857' : '#64748b', fontWeight: '600' }}>
                        {(opp.applicantCount ?? opp.applicantsCount ?? 0)} {(opp.applicantCount === 1 ? 'applicant' : 'applicants')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Candidate Applications Pipeline */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                Pipeline: {selectedOpp?.title || 'Selected Role'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.825rem' }}>
                Review candidate skill telemetry, portfolio links, and advance applicants.
              </p>
            </div>
            {selectedOpp && (
              <span className="badge badge-indigo">
                {applications.length} Candidates
              </span>
            )}
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Users size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                No applications received yet for this role
              </h4>
              <p style={{ fontSize: '0.825rem' }}>
                Candidate submissions and AI fit scores will appear here in real time.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app) => {
                const studentUser = app.student?.user || {};
                const studentProfile = app.student || {};
                const matchScore = app.matchScore || 85;

                return (
                  <div
                    key={app._id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    {/* Candidate Top info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                            {studentUser.name || 'Candidate Name'}
                          </h4>
                          <MatchScoreBadge score={matchScore} size="sm" />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                          {studentProfile.college || 'Engineering College'} {studentProfile.graduationYear ? `· Class of ${studentProfile.graduationYear}` : ''}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: '500' }}>Status:</span>
                        <select
                          value={app.status === 'applied' ? 'submitted' : app.status === 'reviewing' ? 'under-review' : app.status}
                          disabled={updatingAppId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="input-field"
                          style={{
                            padding: '0.3rem 0.65rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            width: 'auto'
                          }}
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under-review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted / Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Candidate Pitch / Cover Note */}
                    {app.coverLetter && (
                      <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '0.75rem 0.9rem',
                        fontSize: '0.85rem',
                        color: '#334155',
                        lineHeight: '1.45'
                      }}>
                        "{app.coverLetter}"
                      </div>
                    )}

                    {/* Skills and portfolio links */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {studentProfile.skills?.slice(0, 5).map((sk, i) => (
                          <SkillTag key={i} name={sk.name} verified={sk.verified} />
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.65rem', fontSize: '0.785rem' }}
                          >
                            <ExternalLink size={12} />
                            <span>Portfolio / Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
