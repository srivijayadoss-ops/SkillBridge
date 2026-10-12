import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Bot, 
  CheckCircle2, 
  Layers,
  Cpu,
  TrendingUp,
  Target,
  Code2,
  Users,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
      {/* 1. Hero Section */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        paddingTop: '5rem',
        paddingBottom: '5rem'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-indigo" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}>
              AI-Powered Skill Verification Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '800',
            lineHeight: '1.18',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            color: '#0f172a'
          }}>
            Bridging the Gap Between <br />
            Student Talent & <span style={{ color: '#2563eb' }}>Industry Demand</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#475569',
            lineHeight: '1.65',
            maxWidth: '720px',
            margin: '0 auto 2.25rem auto'
          }}>
            SkillBridge is a talent platform built to eliminate graduate underemployment. We replace unverified resumes with practical code telemetry, verifiable engineering challenges, and semantic AI matching.
          </p>

          {/* Primary Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap'
          }}>
            {user ? (
              <Link 
                to={user.role === 'recruiter' ? '/recruiter-dashboard' : '/student-dashboard'} 
                className="btn btn-primary btn-lg"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/login" className="btn btn-secondary btn-lg">
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Overview / About Section */}
      <section id="about" className="container" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>Our Mission</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
            Next-Generation Skill Verification
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.65' }}>
            Transforming how emerging engineering talent connects with leading companies by prioritizing demonstrable technical capability over static paper credentials.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* The Problem */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '8px',
              backgroundColor: '#fff1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e11d48',
              marginBottom: '1.25rem'
            }}>
              <Target size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
              The Core Problem
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#475569', fontSize: '0.925rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#e11d48', fontWeight: '700' }}>✕</span>
                <span><strong>Unverified Resumes:</strong> Paper resumes favor buzzword stuffing over real software implementation skills.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#e11d48', fontWeight: '700' }}>✕</span>
                <span><strong>Screening Fatigue:</strong> Recruiters drown in hundreds of generic applications and default to arbitrary tier-1 college filters.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#e11d48', fontWeight: '700' }}>✕</span>
                <span><strong>Unclear Feedback:</strong> Rejected students receive automated rejection emails with zero guidance on what technical gaps they need to bridge.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{
              width: '2.6rem',
              height: '2.6rem',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
              The SkillBridge Solution
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#475569', fontSize: '0.925rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#059669', fontWeight: '700' }}>✓</span>
                <span><strong>Proof-of-Skill Telemetry:</strong> Verifiable GitHub repository links, live demos, and solved engineering challenges.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#059669', fontWeight: '700' }}>✓</span>
                <span><strong>Gemini 1.5 Semantic Matching:</strong> Multi-dimensional fit scoring evaluating technical depth, transferable skills, and project relevance.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: '1.5' }}>
                <span style={{ color: '#059669', fontWeight: '700' }}>✓</span>
                <span><strong>Automated Bridging Roadmaps:</strong> Clear 4-week step-by-step guidance pinpointing exact missing competencies for target roles.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '5rem 0',
        scrollMarginTop: '4rem'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>The Process</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
              How It Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
              A streamlined 3-stage pipeline delivering verifiable competency and transparent placement.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem'
            }}>
              <div style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Build Verified Skill Profile
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Students declare technical competencies, link real GitHub repositories, showcase live project deployments, and solve micro-challenges.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem'
            }}>
              <div style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                AI Semantic Match & Gap Audit
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our Gemini AI engine analyzes context and project stack against job requirements, generating match scores and actionable bridging roadmaps.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem'
            }}>
              <div style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Direct Recruiter Engagement
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Hiring managers review candidates ranked by verifiable skill proof. Transparent pipelines update application status in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Platform Pillars & Solutions */}
      <section id="solutions" className="container" style={{ scrollMarginTop: '6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>Solutions</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.85rem' }}>
            Built for Students & Employers
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
            A unified talent marketplace designed for merit-first growth and data-backed hiring.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* For Talent */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}>
                <Code2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '750', color: '#0f172a' }}>
                For Students & Builders
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.925rem', color: '#475569' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Proof Over Paper</strong>
                <span>Stand out by what you can actually build, code, and deploy rather than test scores.</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Personalized Career Coaching</strong>
                <span>Receive Gemini-generated 4-week learning roadmaps tailored specifically to the technologies missing from your profile.</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Transparent Application Tracking</strong>
                <span>Live status updates: Applied ➔ Reviewing ➔ Shortlisted ➔ Accepted, with no black-hole silence.</span>
              </div>
            </div>
          </div>

          {/* For Recruiters */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '750', color: '#0f172a' }}>
                For Employers & Recruiters
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.925rem', color: '#475569' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>70% Faster Screening</strong>
                <span>Review candidate submissions pre-ranked by verifiable technical telemetry and project depth.</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Direct Code Inspection</strong>
                <span>Access candidate GitHub repositories, deployment previews, and challenge solutions with one click.</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Unified Applicant Tracking</strong>
                <span>Post structured roles with custom stipend terms, manage candidate stages, and advance top matches seamlessly.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Architecture Section */}
      <section id="architecture" className="container" style={{ scrollMarginTop: '6rem' }}>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>Technology & Security</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.65rem' }}>
              Enterprise Architecture & Intelligence
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
              Engineered with Gemini 1.5, Argon2id cryptography, and progressive offline-first resilience.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Cpu size={18} color="#2563eb" />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Google Gemini 1.5</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Contextual semantic analysis evaluates candidate skills against market expectations and generates actionable improvement roadmaps.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={18} color="#059669" />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Argon2id Security</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Memory-hard password hashing with Argon2id, HTTP-only secure cookie session storage, rate limiting, and CORS isolation.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layers size={18} color="#0284c7" />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>PWA Offline First</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Full Progressive Web App with Workbox service workers and web app manifest, installable on desktop and mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="container">
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '0.75rem' }}>
            Ready to Experience Skill-First Talent Matching?
          </h2>
          <p style={{ color: '#3b82f6', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 2rem', fontWeight: '500' }}>
            Sign in with your account credentials or create a new profile to access the talent platform.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
