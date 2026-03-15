// src/pages/RoadmapDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import api from '../utils/api';

const LEVEL_COLORS = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  back: { color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' },
  header: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  desc: { color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1rem' },
  prereq: { background: '#0f0f1a', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#94a3b8' },
  prereqTitle: { fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' },
  module: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' },
  moduleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  moduleName: { fontWeight: 700, fontSize: '1.05rem' },
  badges: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
  levelBadge: (lvl) => ({ background: `${LEVEL_COLORS[lvl]}22`, color: LEVEL_COLORS[lvl], padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }),
  timeBadge: { background: '#1e293b', color: '#94a3b8', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem' },
  topicList: { listStyle: 'none', padding: 0 },
  topic: { color: '#94a3b8', fontSize: '0.88rem', padding: '4px 0', paddingLeft: '1rem', position: 'relative' },
  ytLink: { color: '#06b6d4', textDecoration: 'none', fontSize: '0.82rem', display: 'inline-block', marginTop: '0.75rem', fontWeight: 600 },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #2d2d4e' },
  check: { width: '18px', height: '18px', accentColor: '#7c3aed', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '4rem', color: '#7c3aed' },
};

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/roadmaps/${id}`).then(r => {
      setData(r.data);
      const p = {};
      r.data.progress.forEach(pr => { if (pr.completed) p[pr.module_index] = true; });
      setProgress(p);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const toggleModule = async (idx) => {
    const newVal = !progress[idx];
    setProgress(prev => ({ ...prev, [idx]: newVal }));
    await api.patch(`/roadmaps/${id}/progress`, { module_index: idx, completed: newVal }).catch(() => {});
  };

  if (loading) return <div style={s.page}><Navbar /><div style={s.loading}>Loading roadmap...</div></div>;
  if (!data) return <div style={s.page}><Navbar /><div style={s.loading}>Roadmap not found.</div></div>;

  const { roadmap } = data;
  const modules = roadmap.modules || [];
  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <Link to="/student" style={s.back}>← Back to Dashboard</Link>
        <div style={s.header}>
          <h1 style={s.title}>{roadmap.title}</h1>
          <p style={s.desc}>{roadmap.description}</p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>📚 {modules.length} modules</span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>⏱ {roadmap.time_hours} hours total</span>
            <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✅ {completedCount}/{modules.length} completed</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', background: '#2d2d4e', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${modules.length ? (completedCount / modules.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.3s' }} />
          </div>
          {roadmap.prerequisites && (
            <div style={{ ...s.prereq, marginTop: '1rem' }}>
              <div style={s.prereqTitle}>Prerequisites</div>
              {roadmap.prerequisites}
            </div>
          )}
        </div>

        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Learning Modules</h2>
        {modules.map((mod, idx) => (
          <div key={idx} style={{ ...s.module, opacity: progress[idx] ? 0.7 : 1 }}>
            <div style={s.moduleHeader}>
              <div style={s.moduleName}>{mod.title}</div>
              <div style={s.badges}>
                <span style={s.levelBadge(mod.level)}>{mod.level}</span>
                <span style={s.timeBadge}>⏱ {mod.elapsed_hours}h</span>
              </div>
            </div>
            <ul style={s.topicList}>
              {(mod.topics || []).map((t, ti) => (
                <li key={ti} style={s.topic}>• {t}</li>
              ))}
            </ul>
            {mod.youtube_query && (
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(mod.youtube_query)}`} target="_blank" rel="noopener noreferrer" style={s.ytLink}>
                ▶ Watch on YouTube
              </a>
            )}
            <div style={s.checkRow}>
              <input type="checkbox" style={s.check} checked={!!progress[idx]} onChange={() => toggleModule(idx)} id={`mod-${idx}`} />
              <label htmlFor={`mod-${idx}`} style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#94a3b8' }}>
                {progress[idx] ? '✅ Completed' : 'Mark as complete'}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
