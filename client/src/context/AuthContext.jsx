import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.auth.me();
      if (data && data.user) {
        setUser(data.user);
        // Load role specific profile
        if (data.user.role === 'student') {
          try {
            const p = await api.student.getProfile();
            setProfile(p.profile || null);
          } catch (e) {
            setProfile(null);
          }
        } else if (data.user.role === 'recruiter') {
          try {
            const p = await api.recruiter.getProfile();
            setProfile(p.profile || null);
          } catch (e) {
            setProfile(null);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    setUser(data.user);
    await refreshUser();
    showToast(`Welcome back, ${data.user.name}!`, 'success');
    return data;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    setUser(data.user);
    await refreshUser();
    showToast(`Welcome to SkillBridge, ${data.user.name}!`, 'success');
    return data;
  };

  const demoLogin = async (role = 'student') => {
    const data = await api.auth.demoLogin(role);
    setUser(data.user);
    await refreshUser();
    showToast(`Logged in as Demo ${role.toUpperCase()}!`, 'success');
    return data;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.warn('Logout error', err);
    }
    setUser(null);
    setProfile(null);
    showToast('Signed out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
        showToast,
        setProfile
      }}
    >
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.15rem',
          borderRadius: '8px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          border: '1px solid #1e293b',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: toastMessage.type === 'success' ? '#10b981' : toastMessage.type === 'error' ? '#f43f5e' : '#3b82f6',
            display: 'inline-block'
          }} />
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
