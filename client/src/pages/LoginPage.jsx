import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, Layers, KeyRound, GraduationCap, Building2, Check } from 'lucide-react';

export default function LoginPage() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filledRole, setFilledRole] = useState(null);

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email: identifier, accountName: identifier, password });
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (data.user.role === 'recruiter') {
        navigate('/recruiter-dashboard', { replace: true });
      } else {
        navigate('/student-dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid account name/email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email, pass, role) => {
    setIdentifier(email);
    setPassword(pass);
    setFilledRole(role);
    setError('');
    setTimeout(() => {
      setFilledRole(null);
    }, 2500);
  };

  return (
    <div className="container" style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: '2.25rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.85rem',
            color: '#ffffff'
          }}>
            <Layers size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            Sign In to SkillBridge
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Enter your account name or email and password to access your dashboard.
          </p>
        </div>

        {user && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: '#15803d',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div>
              Currently logged in as <strong>{user.name}</strong> ({user.role}).
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => navigate(user.role === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard')}
                className="btn btn-primary btn-sm"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={async () => { await logout(); }}
                className="btn btn-secondary btn-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#be123c',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label className="input-label">Account Name / Email Address</label>
            <input
              type="text"
              required
              className="input-field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. Alex Johnson or student@demo.skillswap.dev"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.35rem' }}
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Professional Evaluation Profiles Section */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{
                width: '1.4rem',
                height: '1.4rem',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}>
                <KeyRound size={13} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>
                Evaluation Access Profiles
              </span>
            </div>
            <span style={{
              fontSize: '0.675rem',
              fontWeight: '600',
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: '#e2e8f0',
              color: '#475569'
            }}>
              1-Click Fill
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Student Evaluation Card */}
            <div
              onClick={() => handleFillDemo('student@demo.skillswap.dev', 'DemoPass123!', 'student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: filledRole === 'student' ? '#eff6ff' : '#ffffff',
                border: filledRole === 'student' ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                if (filledRole !== 'student') e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                if (filledRole !== 'student') e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '2.1rem',
                  height: '2.1rem',
                  borderRadius: '7px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0
                }}>
                  <GraduationCap size={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a' }}>
                      Alex Johnson
                    </span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.625rem', padding: '0.05rem 0.35rem' }}>
                      Student
                    </span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.1rem' }}>
                    student@demo.skillswap.dev
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: filledRole === 'student' ? '#1d4ed8' : '#2563eb',
                backgroundColor: filledRole === 'student' ? '#dbeafe' : '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {filledRole === 'student' ? <Check size={12} /> : null}
                {filledRole === 'student' ? 'Applied' : 'Fill'}
              </span>
            </div>

            {/* Recruiter Evaluation Card */}
            <div
              onClick={() => handleFillDemo('recruiter@demo.skillswap.dev', 'DemoPass123!', 'recruiter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: filledRole === 'recruiter' ? '#ecfdf5' : '#ffffff',
                border: filledRole === 'recruiter' ? '1px solid #86efac' : '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                if (filledRole !== 'recruiter') e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                if (filledRole !== 'recruiter') e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '2.1rem',
                  height: '2.1rem',
                  borderRadius: '7px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  flexShrink: 0
                }}>
                  <Building2 size={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a' }}>
                      Priya Sharma
                    </span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.625rem', padding: '0.05rem 0.35rem' }}>
                      Recruiter
                    </span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.1rem' }}>
                    recruiter@demo.skillswap.dev
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: filledRole === 'recruiter' ? '#047857' : '#059669',
                backgroundColor: filledRole === 'recruiter' ? '#d1fae5' : '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {filledRole === 'recruiter' ? <Check size={12} /> : null}
                {filledRole === 'recruiter' ? 'Applied' : 'Fill'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.65rem',
            paddingTop: '0.55rem',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.725rem',
            color: '#64748b'
          }}>
            <span>Shared Password:</span>
            <span style={{
              fontFamily: 'monospace',
              fontWeight: '700',
              color: '#0f172a',
              backgroundColor: '#e2e8f0',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px'
            }}>
              DemoPass123!
            </span>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
