import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/SkillTag';
import { 
  Users, 
  Search, 
  GraduationCap, 
  Building2, 
  ExternalLink, 
  X, 
  Award, 
  Layers, 
  Code2, 
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function StudentDirectoryPage() {
  const { user, showToast } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.recruiter.getStudents({
        search: searchTerm,
        skill: selectedSkill
      });
      setStudents(res.students || []);
    } catch (err) {
      console.error('Failed to load student directory:', err);
      showToast('Could not load student directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const popularSkills = ['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB', 'TypeScript', 'CSS', 'AI/ML'];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Page Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-cyan">Talent Directory</span>
          <span className="badge badge-emerald">
            <ShieldCheck size={12} /> Verified Profiles
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
          Student Talent Directory
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '700px' }}>
          Discover and evaluate emerging engineering talent by verified skill telemetry, real code projects, and university credentials.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, Student ID (STU-...), college, or degree..."
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Search Directory
          </button>
        </form>

        {/* Skill filter chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                  padding: '0.2rem 0.65rem',
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

      {/* Directory Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 0.75rem'
          }} />
          <p style={{ color: '#64748b' }}>Loading verified student directory...</p>
        </div>
      ) : students.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 1rem',
          textAlign: 'center'
        }}>
          <Users size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem', color: '#0f172a' }}>
            No student profiles match your search criteria
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Try broadening your search term or clearing the skill filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSkill('');
              loadStudents();
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing <strong>{students.length}</strong> registered students
            </span>
          </div>

          <div className="grid-cols-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.15rem' }}>
                        {student.name}
                      </h3>
                      <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                        ID: {student.studentId}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <GraduationCap size={14} color="#64748b" />
                      <span>{student.college || student.university}</span>
                    </div>
                    {student.degree && (
                      <div style={{ color: '#475569', fontWeight: '500', marginLeft: '1.2rem' }}>
                        {student.degree} {student.graduationYear ? `(Class of ${student.graduationYear})` : ''}
                      </div>
                    )}
                  </div>

                  {student.headline && (
                    <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                      "{student.headline}"
                    </p>
                  )}

                  {/* Skills tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    {student.skills?.slice(0, 5).map((sk, idx) => (
                      <SkillTag key={idx} name={sk.name} level={sk.proficiency} verified={sk.verified} />
                    ))}
                    {student.skills?.length > 5 && (
                      <span style={{ fontSize: '0.725rem', color: '#94a3b8', alignSelf: 'center' }}>
                        +{student.skills.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Career interests */}
                  {student.careerInterests?.length > 0 && (
                    <div style={{ fontSize: '0.785rem', color: '#64748b', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>Interests:</span>
                      {student.careerInterests.slice(0, 3).map((ci, i) => (
                        <span key={i} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{ci}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer action */}
                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {student.projects?.length || 0} projects · {student.completedChallenges || 0} challenges
                  </div>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-indigo">Student ID: {selectedStudent.studentId}</span>
                  <span className="badge badge-emerald">Verified Candidate</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedStudent.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {selectedStudent.college || selectedStudent.university} · {selectedStudent.degree}
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedStudent.bio && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>About</h4>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>{selectedStudent.bio}</p>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.45rem' }}>Skills Portfolio</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {selectedStudent.skills?.map((sk, i) => (
                    <SkillTag key={i} name={sk.name} level={sk.proficiency} verified={sk.verified} />
                  ))}
                </div>
              </div>

              {selectedStudent.projects?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Projects & Code Proof</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedStudent.projects.map((proj, i) => (
                      <div key={i} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem 0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{proj.title}</h5>
                          {proj.url && (
                            <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#2563eb' }}>
                              <ExternalLink size={11} /> View Code
                            </a>
                          )}
                        </div>
                        {proj.description && <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="#2563eb" />
                <div style={{ fontSize: '0.825rem', color: '#1e40af' }}>
                  To invite this candidate for opportunities, post a role or review their submissions in the Candidate Pipeline.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
