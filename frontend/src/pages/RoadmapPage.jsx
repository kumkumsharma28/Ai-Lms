// src/pages/RoadmapPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  main: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#94a3b8', marginBottom: '2.5rem' },
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '16px', padding: '2rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' },
  input: { width: '100%', background: '#0f0f1a', border: '1px solid #2d2d4e', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1.5rem', outline: 'none' },
  numberRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  numBtn: { background: '#0f0f1a', border: '1px solid #2d2d4e', color: '#e2e8f0', width: '36px', height: '36px', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  numVal: { fontSize: '1.2rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' },
  btn: { width: '100%', background: '#7c3aed', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  err: { background: '#7f1d1d44', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' },
  loading: { textAlign: 'center', padding: '2rem', color: '#7c3aed' },
  progress: { height: '4px', background: '#2d2d4e', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden' },
  progressBar: (pct) => ({ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', transition: 'width 0.3s' }),
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', last_course: '', subjects_studied: '', time_hours: 10 });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) { setError('Please enter a subject.'); return; }
    setLoading(true); setError(''); setProgress(10);
    const ticker = setInterval(() => setProgress(p => p < 85 ? p + 5 : p), 800);
    try {
      const res = await api.post('/roadmaps', form);
      clearInterval(ticker); setProgress(100);
      setTimeout(() => navigate(`/roadmap/${res.data.roadmap.id}`), 400);
    } catch (err) {
      clearInterval(ticker); setProgress(0);
      setError(err.response?.data?.message || 'Failed to generate roadmap. Check your API key.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <h1 style={s.title}>🗺️ Roadmap Generator</h1>
        <p style={s.sub}>Generate a detailed AI-powered learning roadmap for any subject.</p>
        <div style={s.card}>
          {error && <div style={s.err}>{error}</div>}
          {loading ? (
            <div style={s.loading}>
              <div style={s.progress}><div style={s.progressBar(progress)} /></div>
              <p>🤖 Claude AI is crafting your personalized roadmap...</p>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>This may take 10–20 seconds</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Enter the last course you were enrolled in:</label>
              <input style={s.input} type="text" value={form.last_course} onChange={e => setForm({ ...form, last_course: e.target.value })} placeholder="e.g., Computer Engineering" />
              <label style={s.label}>Subjects you have studied (separated by commas):</label>
              <input style={s.input} type="text" value={form.subjects_studied} onChange={e => setForm({ ...form, subjects_studied: e.target.value })} placeholder="e.g., Python, Mathematics, Data Structures" />
              <label style={s.label}>Subject you want to learn: *</label>
              <input style={s.input} type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g., Data Science, Machine Learning, Web Dev" required />
              <label style={s.label}>Available study time (hours):</label>
              <div style={s.numberRow}>
                <button type="button" style={s.numBtn} onClick={() => setForm({ ...form, time_hours: Math.max(1, form.time_hours - 1) })}>−</button>
                <span style={s.numVal}>{form.time_hours}</span>
                <button type="button" style={s.numBtn} onClick={() => setForm({ ...form, time_hours: Math.min(500, form.time_hours + 1) })}>+</button>
                <input type="range" min="1" max="200" value={form.time_hours} onChange={e => setForm({ ...form, time_hours: parseInt(e.target.value) })} style={{ flex: 1, accentColor: '#7c3aed' }} />
              </div>
              <button style={s.btn} type="submit">Generate Roadmap</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
