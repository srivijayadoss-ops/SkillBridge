import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  User, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard, 
  Menu, 
  X, 
  Layers, 
  Briefcase, 
  Code2, 
  Sparkles,
  Users,
  Bell,
  Check
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (user) {
      api.user.getNotifications().then((res) => {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }).catch(() => {});
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setNotifDropdownOpen(false);
    }
  }, [user, location.pathname]);

  const handleMarkRead = async (id) => {
    try {
      await api.user.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const brandLink = '/';

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem'
      }}>
        {/* Brand Logo */}
        <Link to={brandLink} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '2.1rem',
            height: '2.1rem',
            borderRadius: '8px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Layers size={18} />
          </div>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            color: '#0f172a'
          }}>
            Skill<span style={{ color: '#2563eb' }}>Bridge</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {/* Public / Logged-Out Users */}
          {!user && (
            <>
              <button 
                type="button"
                onClick={() => scrollToSection('about')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                Overview
              </button>

              <button 
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                How It Works
              </button>

              <button 
                type="button"
                onClick={() => scrollToSection('solutions')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                Solutions
              </button>

              <button 
                type="button"
                onClick={() => scrollToSection('architecture')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                Technology
              </button>
            </>
          )}

          {/* Authenticated Student User Links */}
          {user && user.role === 'student' && (
            <>
              <Link 
                to="/student-dashboard" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/student-dashboard') ? '600' : '500',
                  color: isActive('/student-dashboard') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link 
                to="/opportunities" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/opportunities') ? '600' : '500',
                  color: isActive('/opportunities') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <Briefcase size={16} />
                Opportunities
              </Link>

              <Link 
                to="/challenges" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/challenges') ? '600' : '500',
                  color: isActive('/challenges') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <Code2 size={16} />
                Challenges
              </Link>

              <Link 
                to="/ai-assistant" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/ai-assistant') ? '600' : '500',
                  color: isActive('/ai-assistant') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <Sparkles size={16} color="#4f46e5" />
                AI Coach
              </Link>

              <Link 
                to="/profile" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/profile') ? '600' : '500',
                  color: isActive('/profile') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <User size={16} />
                Profile
              </Link>
            </>
          )}

          {/* Authenticated Recruiter Links */}
          {user && user.role === 'recruiter' && (
            <>
              <Link 
                to="/recruiter-dashboard" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/recruiter-dashboard') ? '600' : '500',
                  color: isActive('/recruiter-dashboard') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <LayoutDashboard size={16} />
                Candidate Pipeline
              </Link>

              <Link 
                to="/students" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/students') || isActive('/student-directory') ? '600' : '500',
                  color: isActive('/students') || isActive('/student-directory') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <Users size={16} />
                Candidate Directory
              </Link>

              <Link 
                to="/opportunities" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive('/opportunities') ? '600' : '500',
                  color: isActive('/opportunities') ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
              >
                <Briefcase size={16} />
                Opportunities
              </Link>

              <Link 
                to="/post-opportunity" 
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
              >
                <PlusCircle size={14} />
                Post Role
              </Link>
            </>
          )}
        </div>

        {/* Right CTA / User controls */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-nav">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1.15rem', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}
                  title="Notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '0.1rem 0.35rem',
                      minWidth: '16px',
                      textAlign: 'center',
                      lineHeight: '1'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>Notifications</h4>
                      {unreadCount > 0 && <span className="badge badge-rose">{unreadCount} new</span>}
                    </div>

                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>
                        No notifications yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                        {notifications.slice(0, 5).map(n => (
                          <div
                            key={n._id}
                            style={{
                              backgroundColor: n.read ? '#f8fafc' : '#eff6ff',
                              border: n.read ? '1px solid #f1f5f9' : '1px solid #dbeafe',
                              borderRadius: '6px',
                              padding: '0.6rem 0.75rem',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.15rem' }}>{n.title}</div>
                            <div style={{ color: '#475569', fontSize: '0.75rem', lineHeight: '1.4' }}>{n.message}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                              {!n.read && (
                                <button
                                  onClick={() => handleMarkRead(n._id)}
                                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600', padding: 0 }}
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {user.role === 'student' && (
                <Link to="/profile" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>
                  <User size={14} color="#64748b" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    Student
                  </span>
                </Link>
              )}
              {user.role === 'recruiter' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600' }}>{user.name}</span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Recruiter</span>
                </div>
              )}
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ padding: '0.45rem 0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'transparent',
            border: 'none',
            color: '#0f172a',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Mobile Navigation for Public / Logged-Out Users */}
          {!user && (
            <>
              <button 
                type="button"
                onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: '0.4rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}
              >
                Overview
              </button>
              <button 
                type="button"
                onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: '0.4rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}
              >
                How It Works
              </button>
              <button 
                type="button"
                onClick={() => { scrollToSection('solutions'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: '0.4rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}
              >
                Solutions
              </button>
              <button 
                type="button"
                onClick={() => { scrollToSection('architecture'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: '0.4rem 0', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}
              >
                Technology
              </button>
            </>
          )}

          {/* Mobile Navigation for Students */}
          {user && user.role === 'student' && (
            <>
              <Link 
                to="/student-dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#2563eb', fontWeight: '600' }}
              >
                <LayoutDashboard size={16} /> My Dashboard
              </Link>
              <Link 
                to="/opportunities" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <Briefcase size={16} /> Opportunities
              </Link>
              <Link 
                to="/challenges" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <Code2 size={16} /> Micro-Challenges
              </Link>
              <Link 
                to="/ai-assistant" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <Sparkles size={16} color="#4f46e5" /> AI Coach
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <User size={16} /> Profile & Skills
              </Link>
            </>
          )}

          {/* Mobile Navigation for Recruiters */}
          {user && user.role === 'recruiter' && (
            <>
              <Link 
                to="/recruiter-dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#2563eb', fontWeight: '600' }}
              >
                <LayoutDashboard size={16} /> Candidate Pipeline
              </Link>
              <Link 
                to="/students" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <Users size={16} /> Candidate Directory
              </Link>
              <Link 
                to="/opportunities" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <Briefcase size={16} /> Opportunities
              </Link>
              <Link 
                to="/post-opportunity" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', color: '#475569' }}
              >
                <PlusCircle size={16} /> Post Opportunity
              </Link>
            </>
          )}

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.4rem 0' }} />

          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Get Started
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
              className="btn btn-danger" 
              style={{ width: '100%' }}
            >
              <LogOut size={15} /> Sign Out ({user.name})
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
