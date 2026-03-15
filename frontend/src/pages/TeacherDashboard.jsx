// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/shared/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' },
  sub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' },
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '1.5rem' },
  cardTitle: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' },
  cardVal: { fontSize: '2rem', fontWeight: 800 },
  sectionTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', marginTop: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a1a2e', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid #2d2d4e' },
  td: { padding: '12px 16px', borderBottom: '1px solid #1e293b', color: '#e2e8f0', fontSize: '0.9rem' },
  tag: (c) => ({ background: `${c}22`, color: c, padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }),
  empty: { color: '#64748b', textAlign: 'center', padding: '2rem', background: '#1a1a2e', borderRadius: '10px' },
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    api.get('/users/students').then(r => setStudents(r.data.students)).catch(() => {});
  }, []);

  const viewPortfolio = async (studentId) => {
    setSelected(studentId);
    const res = await api.get(`/users/students/${studentId}/portfolio`);
    setPortfolio(res.data);
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <h1 style={s.title}>Teacher Dashboard</h1>
        <p style={s.sub}>Welcome back, {user?.full_name}. Monitor and guide your students.</p>

        <div style={s.grid}>
          <div style={s.card}><div style={s.cardTitle}>Total Students</div><div style={s.cardVal}>{students.length}</div></div>
          <div style={s.card}><div style={s.cardTitle}>Role</div><div style={{ ...s.cardVal, fontSize: '1.2rem', paddingTop: '0.5rem' }}>👩‍🏫 Teacher</div></div>
        </div>

        <div style={s.sectionTitle}>Student Records</div>
        {students.length === 0 ? (
          <div style={s.empty}>No students registered yet.</div>
        ) : (
          <div style={{ overflowX: 'auto', background: '#1a1a2e', borderRadius: '12px', border: '1px solid #2d2d4e' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Last Course</th>
                  <th style={s.th}>Skills</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(st => (
                  <tr key={st.id}>
                    <td style={s.td}>{st.full_name}</td>
                    <td style={{ ...s.td, color: '#64748b' }}>{st.email}</td>
                    <td style={s.td}>{st.last_course || '—'}</td>
                    <td style={s.td}>{st.skills ? <span style={s.tag('#06b6d4')}>{st.skills.split(',')[0]}</span> : '—'}</td>
                    <td style={s.td}>
                      <button onClick={() => viewPortfolio(st.id)} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>
                        View Portfolio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {portfolio && (
          <div style={{ marginTop: '2rem', background: '#1a1a2e', border: '1px solid #7c3aed44', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{portfolio.student.full_name}'s Portfolio</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>{portfolio.student.email}</p>
            {portfolio.student.bio && <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>{portfolio.student.bio}</p>}
            <div style={s.sectionTitle}>Roadmaps ({portfolio.roadmaps.length})</div>
            {portfolio.roadmaps.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0f0f1a', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span>{r.title || r.subject}</span>
                <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{r.time_hours}h</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
