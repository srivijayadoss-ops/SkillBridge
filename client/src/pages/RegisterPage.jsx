import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, AlertCircle, ArrowRight, Layers, Sparkles, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student specific fields
  const [studentId, setStudentId] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [skills, setSkills] = useState('');
  const [careerInterests, setCareerInterests] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        confirmPassword,
        role,
        ...(role === 'student' ? {
          studentId: studentId.trim() || undefined,
          college: college.trim(),
          university: college.trim(),
          degree: degree.trim(),
          department: degree.trim(),
          graduationYear: parseInt(graduationYear, 10),
          skills: skills.trim(),
          careerInterests: careerInterests.trim()
        } : {
          companyName: companyName.trim(),
          companyWebsite: companyWebsite.trim()
        })
      };

      const data = await register(payload);
      if (data.user?.role === 'recruiter') {
        navigate('/recruiter-dashboard', { replace: true });
      } else {
        navigate('/student-dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: '2.5rem 2.25rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem',
            color: '#ffffff'
          }}>
            <Layers size={22} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            Create Your SkillBridge Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Join the verified Skill-to-Opportunity Platform
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'student' ? '#2563eb' : 'transparent',
              color: role === 'student' ? '#ffffff' : '#475569',
              fontWeight: '600'
            }}
          >
            <User size={14} />
            <span>Student Talent</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`btn btn-sm ${role === 'recruiter' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'recruiter' ? '#2563eb' : 'transparent',
              color: role === 'recruiter' ? '#ffffff' : '#475569',
              fontWeight: '600'
            }}
          >
            <Building2 size={14} />
            <span>Recruiter / Org</span>
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            color: '#be123c',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label className="input-label">Full Name *</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'student' ? 'e.g. Alex Johnson' : 'e.g. Sarah Chen'}
            />
          </div>

          <div>
            <label className="input-label">Email Address *</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.edu"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Password *</label>
              <input
                type="password"
                required
                minLength={8}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 num"
              />
            </div>
            <div>
              <label className="input-label">Confirm Password *</label>
              <input
                type="password"
                required
                minLength={8}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Student ID</label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Leave blank to auto-generate</span>
                </div>
                <input
                  type="text"
                  className="input-field"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2026-8901 (optional)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="input-label">College / University *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                  />
                </div>
                <div>
                  <label className="input-label">Grad Year *</label>
                  <input
                    type="number"
                    required
                    min={2020}
                    max={2035}
                    className="input-field"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2026"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Department / Degree</label>
                <input
                  type="text"
                  className="input-field"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                />
              </div>

              <div>
                <label className="input-label">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, TypeScript, MongoDB"
                />
              </div>

              <div>
                <label className="input-label">Career Interests</label>
                <input
                  type="text"
                  className="input-field"
                  value={careerInterests}
                  onChange={(e) => setCareerInterests(e.target.value)}
                  placeholder="e.g. Full-Stack Development, Cloud Architecture, AI/ML"
                />
              </div>
            </>
          )}

          {/* Recruiter Specific Fields */}
          {role === 'recruiter' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="input-label">Organization / Company *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechNova Solutions"
                />
              </div>
              <div>
                <label className="input-label">Website</label>
                <input
                  type="url"
                  className="input-field"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://company.io"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: '600' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
