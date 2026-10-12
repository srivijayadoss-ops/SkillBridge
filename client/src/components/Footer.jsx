import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      padding: '3.5rem 0 2rem',
      marginTop: '5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '1.9rem',
                height: '1.9rem',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Layers size={16} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                Skill<span style={{ color: '#2563eb' }}>Bridge</span>
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Skill-to-opportunity exchange matching student builders directly with verified tech internships, contracts, and talent recruiters.
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">Problem Statement 18</span>
              <span className="badge badge-emerald">TalentTech AI</span>
            </div>
          </div>

          {/* Quick Pathways */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '1rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/opportunities" style={{ color: '#475569', transition: 'color 0.15s' }}>
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/challenges" style={{ color: '#475569', transition: 'color 0.15s' }}>
                  Engineering Micro-Challenges
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" style={{ color: '#475569', transition: 'color 0.15s' }}>
                  AI Career & Skill Coach
                </Link>
              </li>
              <li>
                <Link to="/student-dashboard" style={{ color: '#475569', transition: 'color 0.15s' }}>
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '1rem' }}>
              For Employers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/post-opportunity" style={{ color: '#475569' }}>
                  Post an Opportunity
                </Link>
              </li>
              <li>
                <Link to="/recruiter-dashboard" style={{ color: '#475569' }}>
                  Candidate Pipeline ATS
                </Link>
              </li>
              <li>
                <span style={{ color: '#94a3b8' }}>Verified Skill Telemetry</span>
              </li>
              <li>
                <span style={{ color: '#94a3b8' }}>Automated Fit Scoring</span>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '1rem' }}>
              Tech Architecture
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Cpu size={15} color="#2563eb" />
                <span>Google Gemini 1.5 Semantic Match</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Shield size={15} color="#059669" />
                <span>Argon2 Security & Secure Sessions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={15} color="#0284c7" />
                <span>Offline-Enabled Progressive Web App</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#94a3b8'
        }}>
          <div>
            &copy; {new Date().getFullYear()} SkillBridge. Built for Problem Statement 18: Employment & TalentTech.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>Production Vercel Ready</span>
            <span>REST API v1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
