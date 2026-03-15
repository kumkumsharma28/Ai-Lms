// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 },
  input: { width: '100%', background: '#0f0f1a', border: '1px solid #2d2d4e', color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1.2rem', outline: 'none' },
  btn: { width: '100%', background: '#7c3aed', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
  err: { background: '#7f1d1d44', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' },
  link: { color: '#7c3aed', textDecoration: 'none' },
  demo: { marginTop: '1.5rem', padding: '1rem', background: '#0f0f1a', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    const demos = { student: 'student@example.com', teacher: 'teacher@example.com', recruiter: 'recruiter@example.com' };
    setForm({ email: demos[role], password: 'password123' });
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Login</h1>
        <p style={s.sub}>Enter your credentials to access your account</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={s.link}>Register</Link>
        </p>
        <div style={s.demo}>
          <p style={{ marginBottom: '8px', fontWeight: 600, color: '#94a3b8' }}>Demo Accounts (password: password123)</p>
          {['student', 'teacher', 'recruiter'].map(r => (
            <button key={r} onClick={() => fillDemo(r)} style={{ marginRight: '8px', background: '#1a1a2e', border: '1px solid #2d2d4e', color: '#94a3b8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', textTransform: 'capitalize' }}>
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
