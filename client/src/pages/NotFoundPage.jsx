import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  const { user } = useAuth();
  const homeTarget = user 
    ? (user.role === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard') 
    : '/';

  return (
    <div className="container" style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          border: '1px solid #dbeafe',
          color: '#2563eb',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <HelpCircle size={28} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '850', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          404 — Page Not Found
        </h1>

        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          The page or resource you requested does not exist or may have been relocated.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to={homeTarget}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
          >
            {user ? <LayoutDashboard size={16} /> : <Home size={16} />}
            <span>{user ? 'Go to Dashboard' : 'Return to Home'}</span>
          </Link>

          <Link
            to="/opportunities"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
          >
            <span>Browse Opportunities</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
