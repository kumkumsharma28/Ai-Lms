// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a' },
  hero: { textAlign: 'center', padding: '6rem 2rem 4rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
  badge: { display: 'inline-block', background: '#7c3aed22', color: '#7c3aed', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' },
  h1: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.2rem', lineHeight: 1.2 },
  grad: { background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem' },
  btnRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { background: '#7c3aed', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' },
  btnSecondary: { background: 'transparent', border: '1px solid #4b5563', color: '#e2e8f0', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' },
  card: { background: '#1a1a2e', border: '1px solid #2d2d4e', borderRadius: '12px', padding: '2rem' },
  icon: { fontSize: '2rem', marginBottom: '1rem' },
  cardTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' },
  cardDesc: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 },
};

export default function HomePage() {
  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.hero}>
        <div style={s.badge}>🤖 Powered by Anthropic Claude AI</div>
        <h1 style={s.h1}>
          <span style={s.grad}>AI-Powered</span> Learning<br />Management System
        </h1>
        <p style={s.sub}>Connect students, teachers, and recruiters in a unified platform. Get personalized learning roadmaps tailored to your goals.</p>
        <div style={s.btnRow}>
          <Link to="/register" style={s.btnPrimary}>Get Started Free</Link>
          <Link to="/login" style={s.btnSecondary}>Login</Link>
        </div>
      </div>
      <div style={s.cards}>
        {[
          { icon: '🎓', title: 'For Students', desc: 'Get AI-generated personalized learning roadmaps, track progress, and build your portfolio to attract recruiters.' },
          { icon: '👩‍🏫', title: 'For Teachers', desc: 'Monitor student progress, manage courses, and provide guidance to keep learners on track.' },
          { icon: '💼', title: 'For Recruiters', desc: 'Browse verified student portfolios, post job listings, and find the best talent matched to your requirements.' },
        ].map((c, i) => (
          <div key={i} style={s.card}>
            <div style={s.icon}>{c.icon}</div>
            <div style={s.cardTitle}>{c.title}</div>
            <p style={s.cardDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
