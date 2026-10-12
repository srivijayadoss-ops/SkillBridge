import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import ChallengesPage from './pages/ChallengesPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostOpportunityPage from './pages/PostOpportunityPage';
import AIAssistantPage from './pages/AIAssistantPage';
import StudentDirectoryPage from './pages/StudentDirectoryPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </main>
      </div>
    );
  }

  const authenticatedRedirect = user?.role === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Default Home / About Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Protected Routes */}
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-opportunity"
            element={
              <ProtectedRoute role="recruiter">
                <PostOpportunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute role="recruiter">
                <StudentDirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-directory"
            element={
              <ProtectedRoute role="recruiter">
                <StudentDirectoryPage />
              </ProtectedRoute>
            }
          />

          {/* Proper 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
