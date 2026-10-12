import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';
import AIModal from '../components/AIModal';
import ApplyModal from '../components/ApplyModal';
import { 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Brain, 
  FileText,
  User,
  ArrowRight,
  Bookmark,
  Bell,
  Clock,
  Check
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile, showToast } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [aiModalType, setAiModalType] = useState(null); // 'gap' or 'resume'
  const [applyingOpp, setApplyingOpp] = useState(null);

  // Build per-student, per-opportunity application lookup map
  const appliedMap = useMemo(() => {
    const map = new Map();
    applications.forEach((app) => {
      const oppId = (app.opportunity?._id || app.opportunity)?.toString();
      if (oppId) {
        map.set(oppId, app.status || 'submitted');
      }
    });
    return map;
  }, [applications]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [appsRes, recsRes, savedRes, notifsRes] = await Promise.all([
          api.applications.listMy().catch(() => ({ applications: [] })),
          api.student.getRecommendations().catch(() => ({ recommendations: [] })),
          api.user.getSaved().catch(() => ({ saved: [] })),
          api.user.getNotifications().catch(() => ({ notifications: [], unreadCount: 0 }))
        ]);

        setApplications(appsRes.applications || []);
        setRecommendations(recsRes.recommendations || []);
        setSavedOpportunities(savedRes.saved || []);
        setNotifications(notifsRes.notifications || []);
        setUnreadNotifsCount(notifsRes.unreadCount || 0);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleMarkNotifRead = async (notifId) => {
    try {
      await api.user.markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
      );
      setUnreadNotifsCount((prev) => Math.max(0, prev - 1));
      showToast('Notification marked as read', 'info');
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const readinessScore = profile?.readinessScore || 78;
  const skills = profile?.skills || [];
  const projects = profile?.projects || [];

  const statusBadge = (status) => {
    switch (status) {
      case 'accepted': 
      case 'offered':
        return <span className="badge badge-emerald">Accepted</span>;
      case 'shortlisted': 
        return <span className="badge badge-cyan">Shortlisted</span>;
      case 'reviewing': 
      case 'under-review':
        return <span className="badge badge-indigo">Under Review</span>;
      case 'rejected': 
        return <span className="badge badge-rose">Not Selected</span>;
      case 'submitted':
      case 'applied':
      default: 
        return <span className="badge badge-gray">Applied</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Student Welcome Header Card */}
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
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-emerald">Student Talent Hub</span>
              <span className="badge badge-indigo">Verified Portfolio</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {profile?.college ? `${profile.college} · Class of ${profile.graduationYear || '2026'}` : 'Manage your applications, skill proof, and AI match roadmaps.'}
            </p>
          </div>

          {/* Readiness Score Gauge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{
              width: '3.6rem',
              height: '3.6rem',
              borderRadius: '50%',
              background: `conic-gradient(#059669 ${readinessScore * 3.6}deg, #e2e8f0 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '2.85rem',
                height: '2.85rem',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}>
                {readinessScore}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                AI Readiness Score
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#047857' }}>
                Industry Ready
              </h4>
              <button
                onClick={() => setAiModalType('gap')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.785rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>Improve Score</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick action bar */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <button
            onClick={() => setAiModalType('gap')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Brain size={14} />
            <span>AI Skill Gap Analysis</span>
          </button>

          <button
            onClick={() => setAiModalType('resume')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <FileText size={14} />
            <span>AI Resume Optimizer</span>
          </button>

          <Link
            to="/profile"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <User size={14} />
            <span>Edit Full Profile</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Active Applications</span>
            <Briefcase size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            {applications.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Verified Skills</span>
            <CheckCircle2 size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#047857' }}>
            {skills.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Projects & Code</span>
            <Layers size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0284c7' }}>
            {projects.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: '500' }}>Bookmarked Roles</span>
            <Bookmark size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#b45309' }}>
            {savedOpportunities.length}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Applications / Right Recommended */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1.2fr)',
        gap: '1.75rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Applications Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Notifications Card */}
          {notifications.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Bell size={16} color="#2563eb" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                    Recruiter Updates & Alerts
                  </h3>
                  {unreadNotifsCount > 0 && (
                    <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                      {unreadNotifsCount} New
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif._id}
                    style={{
                      backgroundColor: notif.read ? '#f8fafc' : '#eff6ff',
                      border: notif.read ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.95rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.15rem' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#334155' }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {!notif.read && (
                      <button
                        onClick={() => handleMarkNotifRead(notif._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap' }}
                      >
                        <Check size={12} /> Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                  My Applications Tracker
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.825rem' }}>
                  Real-time status updates from hiring recruiters
                </p>
              </div>
              <Link to="/opportunities" className="btn btn-secondary btn-sm">
                Apply to More
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>You haven't submitted any applications yet.</p>
                <Link to="/opportunities" className="btn btn-primary btn-sm">
                  Find Matching Internships
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applications.map((app) => (
                  <div
                    key={app._id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.15rem' }}>
                        {app.opportunity?.title || 'Engineering Role'}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.785rem', color: '#64748b' }}>
                        <span style={{ fontWeight: '500' }}>{app.opportunity?.company || 'Company'}</span>
                        <span>•</span>
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {statusBadge(app.status)}
                      {app.matchScore && <MatchScoreBadge score={app.matchScore} size="sm" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Skills Overview */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                My Verified Skills
              </h3>
              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Plus size={13} /> Add Skill
              </Link>
            </div>

            {skills.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                No skills added yet. Complete your profile to activate AI matching.
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {skills.map((s, idx) => (
                  <SkillTag key={idx} name={s.name} level={s.proficiency} verified={s.verified} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Recommendations Feed */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-indigo">
              Top AI Matches
            </span>
          </div>

          {recommendations.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Add more skills to your profile to get personalized AI matching recommendations!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendations.slice(0, 4).map((opp) => {
                const oppId = (opp._id || opp.opportunity?._id)?.toString();
                const isApplied = appliedMap.has(oppId) || Boolean(opp.isApplied);
                const appStatus = appliedMap.get(oppId) || opp.applicationStatus || 'submitted';

                return (
                  <div
                    key={opp._id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      transition: 'border-color 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <Link to={`/opportunities/${opp._id}`}>
                        <h4 style={{ fontSize: '0.925rem', fontWeight: '700', color: '#0f172a' }}>
                          {opp.title}
                        </h4>
                      </Link>
                      <MatchScoreBadge score={opp.matchScore || 88} size="sm" />
                    </div>
                    <div style={{ fontSize: '0.785rem', color: '#64748b', marginBottom: '0.65rem' }}>
                      {opp.company || opp.recruiter?.companyName || 'Hiring Partner'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: '600' }}>
                        {opp.stipend?.amount ? `₹${opp.stipend.amount}/mo` : 'Competitive'}
                      </span>
                      {isApplied ? (
                        <button
                          disabled
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#047857',
                            backgroundColor: '#ecfdf5',
                            borderColor: '#a7f3d0',
                            cursor: 'not-allowed',
                            opacity: 0.95
                          }}
                          title={`Application submitted (${appStatus})`}
                        >
                          ✓ Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => setApplyingOpp(opp)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
                        >
                          Quick Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Modal */}
      {aiModalType && (
        <AIModal
          type={aiModalType}
          onClose={() => setAiModalType(null)}
        />
      )}

      {/* Apply Modal */}
      {applyingOpp && (
        <ApplyModal
          opportunity={applyingOpp}
          onClose={() => setApplyingOpp(null)}
          onSuccess={(newApp) => {
            const oppId = (applyingOpp._id || applyingOpp.opportunity?._id)?.toString();
            api.applications.listMy().then((res) => setApplications(res.applications || []));
            if (oppId) {
              setRecommendations((prev) =>
                prev.map((rec) =>
                  rec._id?.toString() === oppId
                    ? { ...rec, isApplied: true, applicationStatus: 'submitted' }
                    : rec
                )
              );
            }
          }}
        />
      )}
    </div>
  );
}
