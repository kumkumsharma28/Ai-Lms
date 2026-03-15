// src/pages/RecruiterDashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/shared/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' },
  sub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '2rem' },
  tab: (active) => ({ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: active ? '#7c3aed' : '#1a1a2e', color: active ? '#fff' : '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }),
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' },
  cardTitle: { fontWeight: 700, marginBottom: '4px' },
  cardMeta: { color: '#64748b', fontSize: '0.82rem', marginBottom: '0.75rem' },
  badge: { display: 'inline-block', background: '#7c3aed22', color: '#7c3aed', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', marginRight: '0.5rem' },
  form: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' },
  input: { width: '100%', background: '#0f0f1a', border: '1px solid #2d2d4e', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', outline: 'none' },
  btn: { background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  delBtn: { background: '#7f1d1d44', color: '#ef4444', border: '1px solid #ef444444', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
};

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({ position: '', company: user?.full_name || '', location: '', experience_level: 'Mid-Level', skills_required: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/users/students').then(r => setStudents(r.data.students)).catch(() => {});
    api.get('/jobs/mine').then(r => setJobs(r.data.jobs)).catch(() => {});
  }, []);

  const postJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', jobForm);
      const res = await api.get('/jobs/mine');
      setJobs(res.data.jobs);
      setMsg('Job posted!');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to post job.'); }
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <h1 style={s.title}>Recruiter Dashboard</h1>
        <p style={s.sub}>Welcome, {user?.full_name}. Find qualified candidates and manage job postings.</p>

        <div style={s.tabs}>
          {['students', 'jobs', 'post'].map(t => (
            <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
              {t === 'students' ? '👥 Browse Students' : t === 'jobs' ? '📋 My Job Listings' : '+ Post New Job'}
            </button>
          ))}
        </div>

        {tab === 'students' && (
          <div>
            {students.length === 0 ? <div style={{ color: '#64748b' }}>No students found.</div> : students.map(st => (
              <div key={st.id} style={s.card}>
                <div style={s.cardTitle}>{st.full_name}</div>
                <div style={s.cardMeta}>{st.email} • Joined {new Date(st.created_at).toLocaleDateString()}</div>
                {st.last_course && <span style={s.badge}>📚 {st.last_course}</span>}
                {st.skills && st.skills.split(',').slice(0, 3).map((sk, i) => <span key={i} style={s.badge}>{sk.trim()}</span>)}
              </div>
            ))}
          </div>
        )}

        {tab === 'jobs' && (
          <div>
            {jobs.length === 0 ? <div style={{ color: '#64748b' }}>No jobs posted yet. Click "Post New Job".</div> : jobs.map(j => (
              <div key={j.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={s.cardTitle}>{j.position}</div>
                    <div style={s.cardMeta}>{j.company} • {j.location} • {j.experience_level}</div>
                    {j.skills_required && j.skills_required.split(',').map((sk, i) => <span key={i} style={s.badge}>{sk.trim()}</span>)}
                  </div>
                  <button onClick={() => deleteJob(j.id)} style={s.delBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'post' && (
          <div style={s.form}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Post a New Job</h3>
            {msg && <div style={{ color: '#10b981', marginBottom: '1rem', fontWeight: 600 }}>{msg}</div>}
            <form onSubmit={postJob}>
              <label style={s.label}>Position *</label>
              <input style={s.input} value={jobForm.position} onChange={e => setJobForm({ ...jobForm, position: e.target.value })} placeholder="e.g., Data Scientist" required />
              <label style={s.label}>Company *</label>
              <input style={s.input} value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} placeholder="Company name" required />
              <label style={s.label}>Location</label>
              <input style={s.input} value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g., Mumbai, India" />
              <label style={s.label}>Experience Level</label>
              <select style={s.input} value={jobForm.experience_level} onChange={e => setJobForm({ ...jobForm, experience_level: e.target.value })}>
                {['Entry-Level', 'Mid-Level', 'Senior', 'Lead'].map(l => <option key={l}>{l}</option>)}
              </select>
              <label style={s.label}>Skills Required (comma-separated)</label>
              <input style={s.input} value={jobForm.skills_required} onChange={e => setJobForm({ ...jobForm, skills_required: e.target.value })} placeholder="Python, Machine Learning, SQL" />
              <label style={s.label}>Job Description</label>
              <textarea style={{ ...s.input, minHeight: '100px', resize: 'vertical' }} value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role..." />
              <button style={s.btn} type="submit">Post Job</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
