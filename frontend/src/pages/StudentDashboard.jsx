// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  greeting: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' },
  sub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' },
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '1.5rem' },
  cardTitle: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  cardVal: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' },
  ctaRow: { display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' },
  btnPrimary: { background: '#7c3aed', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  btnSecondary: { background: '#1a1a2e', border: '1px solid #2d2d4e', color: '#e2e8f0', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  sectionTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' },
  roadmapCard: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '10px', padding: '1.2rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: { background: '#7c3aed22', color: '#7c3aed', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem' },
  empty: { color: '#64748b', textAlign: 'center', padding: '2rem', background: '#1a1a2e', borderRadius: '10px' },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get('/roadmaps').then(r => setRoadmaps(r.data.roadmaps)).catch(() => {});
    api.get('/users/activity').then(r => setActivity(r.data.activity)).catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <h1 style={s.greeting}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
        <p style={s.sub}>Manage your learning journey and track your progress.</p>

        <div style={s.grid}>
          <div style={s.card}>
            <div style={s.cardTitle}>Total Roadmaps</div>
            <div style={s.cardVal}>{roadmaps.length}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Learning paths generated</div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Active Learning</div>
            <div style={s.cardVal}>{roadmaps.filter(r => r.status === 'active').length}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Roadmaps in progress</div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Total Hours Planned</div>
            <div style={s.cardVal}>{roadmaps.reduce((a, r) => a + (r.time_hours || 0), 0)}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Hours of learning content</div>
          </div>
        </div>

        <div style={s.ctaRow}>
          <Link to="/roadmap/generate" style={s.btnPrimary}>🤖 Generate New Roadmap</Link>
          <Link to="/student" style={s.btnSecondary}>📁 View Portfolio</Link>
        </div>

        <div style={s.sectionTitle}>My Learning Roadmaps</div>
        {roadmaps.length === 0 ? (
          <div style={s.empty}>
            <p>No roadmaps yet.</p>
            <Link to="/roadmap/generate" style={{ ...s.btnPrimary, display: 'inline-block', marginTop: '1rem' }}>Generate Your First Roadmap</Link>
          </div>
        ) : (
          roadmaps.map(r => (
            <div key={r.id} style={s.roadmapCard}>
              <div>
                <div style={{ fontWeight: 700 }}>{r.title || r.subject}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>{r.time_hours} hours • {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={s.tag}>{r.subject}</span>
                <Link to={`/roadmap/${r.id}`} style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>View →</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
