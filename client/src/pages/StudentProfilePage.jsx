import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AIModal from '../components/AIModal';
import { 
  Plus, 
  Trash2, 
  Github, 
  Globe, 
  Save, 
  CheckCircle2,
  Brain
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, profile, refreshUser, showToast } = useAuth();

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // Skills management
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate');

  // Projects management
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');
  const [newProjectLive, setNewProjectLive] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  const [saving, setSaving] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setCollege(profile.college || '');
      setGraduationYear(profile.graduationYear || '2026');
      setGithubUrl(profile.githubUrl || '');
      setPortfolioUrl(profile.portfolioUrl || '');
      setLinkedinUrl(profile.linkedinUrl || '');
      setSkills(profile.skills || []);
      setProjects(profile.projects || []);
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.student.updateProfile({
        headline,
        bio,
        college,
        graduationYear: parseInt(graduationYear, 10),
        githubUrl,
        portfolioUrl,
        linkedinUrl
      });
      await refreshUser();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await api.student.addSkill({
        name: newSkillName.trim(),
        proficiency: newSkillLevel
      });
      setSkills((prev) => [...prev, { name: newSkillName.trim(), proficiency: newSkillLevel, verified: true }]);
      setNewSkillName('');
      await refreshUser();
      showToast(`Added ${newSkillName} to verified skills`, 'success');
    } catch (err) {
      showToast('Could not add skill', 'error');
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      await api.student.removeSkill(skillName);
      setSkills((prev) => prev.filter((s) => s.name !== skillName));
      await refreshUser();
      showToast(`Removed ${skillName}`, 'info');
    } catch (err) {
      showToast('Could not remove skill', 'error');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      const techArray = newProjectTech.split(',').map((t) => t.trim()).filter(Boolean);
      await api.student.addProject({
        title: newProjectTitle,
        description: newProjectDesc,
        techStack: techArray,
        githubUrl: newProjectGithub,
        liveUrl: newProjectLive
      });
      await refreshUser();
      setShowAddProject(false);
      setNewProjectTitle('');
      setNewProjectDesc('');
      setNewProjectTech('');
      setNewProjectGithub('');
      setNewProjectLive('');
      showToast('Project added to portfolio!', 'success');
    } catch (err) {
      showToast('Could not add project', 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-emerald">Live Portfolio</span>
            <span className="badge badge-indigo">AI Readiness: {profile?.readinessScore || 78}%</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
            Student Profile & Engineering Proof
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Your verified telemetry, practical projects, and recruiter-facing credentials.
          </p>
        </div>

        <button
          onClick={() => setShowResumeModal(true)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Brain size={15} color="#2563eb" />
          <span>AI Resume Audit</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Core Profile Form */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '1.75rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Personal & Academic Information
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="input-label">Headline / Target Track</label>
                <input
                  type="text"
                  className="input-field"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Engineer & Open Source Contributor"
                />
              </div>

              <div>
                <label className="input-label">College / University</label>
                <input
                  type="text"
                  className="input-field"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Bio / Technical Summary</label>
              <textarea
                className="input-field"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical background, preferred stacks, and recent achievements..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Graduation Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">GitHub URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="input-label">Portfolio URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={15} />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Skills Management */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '1.75rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
            Verified Skills Graph
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Skills added here feed directly into the Gemini semantic matching engine.
          </p>

          {/* Existing Skills List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {skills.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: '#1e40af'
                }}
              >
                <CheckCircle2 size={13} color="#2563eb" />
                <span style={{ fontWeight: '600' }}>{s.name}</span>
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>({s.proficiency})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.name)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0 0.15rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Remove skill"
                >
                  <Trash2 size={12} color="#e11d48" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill Mini Form */}
          <form onSubmit={handleAddSkill} style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            backgroundColor: '#f8fafc',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0'
          }}>
            <input
              type="text"
              className="input-field"
              style={{ flex: '1 1 200px' }}
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Next.js, Docker, PyTorch..."
            />

            <select
              className="input-field"
              style={{ width: 'auto' }}
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <button type="submit" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Plus size={14} /> Add Skill
            </button>
          </form>
        </div>

        {/* Projects Showcase */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          padding: '1.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                Featured Projects & Code Proof
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.825rem' }}>
                Demonstrate real engineering capabilities with live links.
              </p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} />
              <span>{showAddProject ? 'Cancel' : 'Add Project'}</span>
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={handleAddProject} style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>New Project Details</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">Project Title *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                  />
                </div>
                <div>
                  <label className="input-label">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newProjectTech}
                    onChange={(e) => setNewProjectTech(e.target.value)}
                    placeholder="Node.js, Redis, Docker, React"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Brief Description</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="What does it do? What architectural problems did you solve?"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className="input-label">GitHub URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newProjectGithub}
                    onChange={(e) => setNewProjectGithub(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="input-label">Live Demo URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newProjectLive}
                    onChange={(e) => setNewProjectLive(e.target.value)}
                    placeholder="https://myproject.app"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.35rem' }}>
                <button type="button" onClick={() => setShowAddProject(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald btn-sm">
                  Save Project
                </button>
              </div>
            </form>
          )}

          {/* Project Cards List */}
          {projects.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              No projects added yet. Click 'Add Project' to showcase your code!
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {projects.map((proj, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
                    {proj.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.85rem', lineHeight: '1.4' }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                    {proj.techStack?.map((t, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.785rem', color: '#2563eb', fontWeight: '600' }}>
                        <Github size={13} /> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.785rem', color: '#059669', fontWeight: '600' }}>
                        <Globe size={13} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Resume Modal */}
      {showResumeModal && (
        <AIModal
          type="resume"
          initialData={{ resumeText: `${headline}\n${bio}\nSkills: ${skills.map(s => s.name).join(', ')}` }}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  );
}
