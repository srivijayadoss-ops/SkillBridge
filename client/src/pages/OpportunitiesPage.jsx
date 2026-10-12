import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import ApplyModal from '../components/ApplyModal';
import { 
  Search, 
  Briefcase, 
  Sparkles, 
  X
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { user, profile, showToast } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedMap, setAppliedMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');

  // Active modal
  const [applyingOpportunity, setApplyingOpportunity] = useState(null);

  const userSkills = useMemo(() => {
    return profile?.skills?.map((s) => s.name) || [];
  }, [profile]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.opportunities.list({
        search: searchTerm,
        type: selectedType === 'all' ? '' : selectedType,
        remote: remoteOnly ? 'true' : '',
        skill: selectedSkill
      });
      setOpportunities(res.opportunities || []);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentApplications = async () => {
    if (user && user.role === 'student') {
      try {
        const res = await api.applications.listMy();
        const map = new Map();
        (res.applications || []).forEach(a => {
          const oppId = (a.opportunity?._id || a.opportunity)?.toString();
          if (oppId) map.set(oppId, a.status || 'submitted');
        });
        setAppliedMap(map);
      } catch (e) {
        console.error('Error loading student applications:', e);
      }
    } else {
      setAppliedMap(new Map());
    }
  };

  useEffect(() => {
    if (user && user.role === 'student') {
      api.user.getSaved().then((res) => {
        if (res && res.saved) {
          const ids = new Set(res.saved.map(item => item?._id || item?.opportunity?._id || item?.opportunity));
          setSavedIds(ids);
        }
      }).catch(() => {});
      loadStudentApplications();
    } else {
      setSavedIds(new Set());
      setAppliedMap(new Map());
    }
  }, [user]);

  useEffect(() => {
    loadOpportunities();
  }, [selectedType, remoteOnly, selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOpportunities();
  };

  const handleToggleSave = async (oppId) => {
    if (!user) {
      showToast('Please log in to bookmark opportunities.', 'info');
      return;
    }
    const isSaved = savedIds.has(oppId);
    try {
      if (isSaved) {
        await api.user.unsaveOpportunity(oppId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(oppId);
          return next;
        });
        showToast('Removed from saved list', 'info');
      } else {
        await api.user.saveOpportunity(oppId);
        setSavedIds((prev) => new Set(prev).add(oppId));
        showToast('Saved to your bookmarks!', 'success');
      }
    } catch (err) {
      showToast('Could not update saved status.', 'error');
    }
  };

  const types = [
    { id: 'all', label: 'All Roles' },
    { id: 'internship', label: 'Internships' },
    { id: 'project', label: 'Live Projects' },
    { id: 'freelance', label: 'Freelance Gigs' },
    { id: 'research', label: 'Research' }
  ];

  const popularSkills = ['React', 'Node.js', 'Python', 'TypeScript', 'UI/UX', 'MongoDB', 'AI/ML'];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-indigo">
            <Briefcase size={12} /> Live Opportunity Exchange
          </span>
          {user && user.role === 'student' && (
            <span className="badge badge-emerald">
              <Sparkles size={12} /> AI Matching Active
            </span>
          )}
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
          Explore Student Opportunities
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.975rem', maxWidth: '650px' }}>
          Verified micro-internships, engineering contracts, and startup roles filtered with precision.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, technology, or company name..."
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filters Row: Type Tabs & Remote Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '0.85rem'
        }}>
          {/* Type tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`btn btn-sm ${selectedType === t.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Remote checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              style={{ accentColor: '#2563eb', width: '0.95rem', height: '0.95rem' }}
            />
            <span>Remote Only</span>
          </label>
        </div>

        {/* Skill filter chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
            Filter by Skill:
          </span>
          {popularSkills.map((sk) => {
            const isSelected = selectedSkill.toLowerCase() === sk.toLowerCase();
            return (
              <button
                key={sk}
                type="button"
                onClick={() => setSelectedSkill(isSelected ? '' : sk)}
                style={{
                  backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  color: isSelected ? '#ffffff' : '#475569',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.15s'
                }}
              >
                <span>{sk}</span>
                {isSelected && <X size={12} />}
              </button>
            );
          })}
          {selectedSkill && (
            <button
              onClick={() => setSelectedSkill('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e11d48',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '0.4rem'
              }}
            >
              Reset Skill Filter
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Grid / Status */}
      {loading ? (
        <div style={{
          padding: '4rem 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Loading verified opportunities & AI fit scores...
          </p>
        </div>
      ) : opportunities.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 1rem',
          textAlign: 'center'
        }}>
          <Briefcase size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem', color: '#0f172a' }}>
            No opportunities match your current filters
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Try adjusting your search query or clearing specific skill filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setRemoteOnly(false);
              setSelectedSkill('');
              loadOpportunities();
            }}
            className="btn btn-secondary"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing <strong>{opportunities.length}</strong> available openings
            </span>
          </div>

          <div className="grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                isSaved={savedIds.has(opp._id)}
                onToggleSave={handleToggleSave}
                onApply={(targetOpp) => setApplyingOpportunity(targetOpp)}
                userSkills={userSkills}
                isApplied={appliedMap.has(opp._id.toString())}
                applicationStatus={appliedMap.get(opp._id.toString())}
              />
            ))}
          </div>
        </>
      )}

      {/* Apply Modal */}
      {applyingOpportunity && (
        <ApplyModal
          opportunity={applyingOpportunity}
          onClose={() => setApplyingOpportunity(null)}
          onSuccess={() => {
            loadOpportunities();
            loadStudentApplications();
          }}
        />
      )}
    </div>
  );
}
