// src/components/shared/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const s = {
  nav: { background: '#1a1a2e', borderBottom: '1px solid #2d2d4e', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  brand: { color: '#7c3aed', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  user: { color: '#94a3b8', fontSize: '0.9rem' },
  role: { background: '#7c3aed22', color: '#7c3aed', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' },
  btn: { background: 'transparent', border: '1px solid #4b5563', color: '#94a3b8', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>Scholar Pathway Portal</Link>
      <div style={s.right}>
        {user ? (
          <>
            <span style={s.user}>{user.full_name}</span>
            <span style={s.role}>{user.role}</span>
            <Link to="/dashboard" style={s.link}>Dashboard</Link>
            <button onClick={handleLogout} style={s.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.link}>Login</Link>
            <Link to="/register" style={{ ...s.btn, background: '#7c3aed', border: 'none', color: '#fff' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
