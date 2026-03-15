// src/pages/RegisterPage.jsx
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
  roles: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
  roleBtn: (active) => ({ flex: 1, padding: '10px', border: `2px solid ${active ? '#7c3aed' : '#2d2d4e'}`, background: active ? '#7c3aed22' : 'transparent', color: active ? '#7c3aed' : '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }),
  btn: { width: '100%', background: '#7c3aed', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  err: { background: '#7f1d1d44', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' },
  link: { color: '#7c3aed', textDecoration: 'none' },
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const user = await register(form.full_name, form.email, form.password, form.role);
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Create an Account</h1>
        <p style={s.sub}>Enter your information to get started</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required />
          <label style={s.label}>I am a</label>
          <div style={s.roles}>
            {['student', 'teacher', 'recruiter'].map(r => (
              <button key={r} type="button" style={s.roleBtn(form.role === r)} onClick={() => setForm({ ...form, role: r })}>{r}</button>
            ))}
          </div>
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={s.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}
