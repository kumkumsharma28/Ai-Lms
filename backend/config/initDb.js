// config/initDb.js
require('dotenv').config();
const { initDatabase } = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const initDb = async () => {
  const db = await initDatabase();

  db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`);
  db.exec(`CREATE TABLE IF NOT EXISTS student_profiles (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, last_course TEXT, subjects_studied TEXT, bio TEXT, skills TEXT, github_url TEXT, linkedin_url TEXT)`);
  db.exec(`CREATE TABLE IF NOT EXISTS teacher_profiles (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, expertise TEXT, bio TEXT, department TEXT)`);
  db.exec(`CREATE TABLE IF NOT EXISTS recruiter_profiles (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, company TEXT, bio TEXT, industry TEXT)`);
  db.exec(`CREATE TABLE IF NOT EXISTS roadmaps (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, subject TEXT NOT NULL, last_course TEXT, subjects_studied TEXT, time_hours INTEGER NOT NULL, title TEXT, description TEXT, prerequisites TEXT, modules TEXT, status TEXT DEFAULT 'active', created_at TEXT DEFAULT (datetime('now')))`);
  db.exec(`CREATE TABLE IF NOT EXISTS roadmap_progress (id TEXT PRIMARY KEY, roadmap_id TEXT NOT NULL, user_id TEXT NOT NULL, module_index INTEGER NOT NULL, completed INTEGER DEFAULT 0, completed_at TEXT)`);
  db.exec(`CREATE TABLE IF NOT EXISTS courses (id TEXT PRIMARY KEY, teacher_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT, subject TEXT, content TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  db.exec(`CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, recruiter_id TEXT NOT NULL, position TEXT NOT NULL, company TEXT NOT NULL, location TEXT, experience_level TEXT, skills_required TEXT, description TEXT, created_at TEXT DEFAULT (datetime('now')))`);
  db.exec(`CREATE TABLE IF NOT EXISTS activity_log (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, action TEXT NOT NULL, description TEXT, created_at TEXT DEFAULT (datetime('now')))`);

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('student@example.com');
  if (!existing) {
    const hash = bcrypt.hashSync('password123', 10);
    const users = [
      { id: uuidv4(), name: 'Alex Student', email: 'student@example.com', role: 'student' },
      { id: uuidv4(), name: 'Dr. Smith', email: 'teacher@example.com', role: 'teacher' },
      { id: uuidv4(), name: 'Jane Recruiter', email: 'recruiter@example.com', role: 'recruiter' },
    ];
    for (const u of users) {
      db.prepare('INSERT INTO users (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(u.id, u.name, u.email, hash, u.role);
      if (u.role === 'student') db.prepare('INSERT INTO student_profiles (id, user_id) VALUES (?, ?)').run(uuidv4(), u.id);
      if (u.role === 'teacher') db.prepare('INSERT INTO teacher_profiles (id, user_id) VALUES (?, ?)').run(uuidv4(), u.id);
      if (u.role === 'recruiter') db.prepare('INSERT INTO recruiter_profiles (id, user_id) VALUES (?, ?)').run(uuidv4(), u.id);
    }
    console.log('✅ Demo users seeded.');
  }
  console.log('✅ Database initialized successfully.');
};

initDb().catch(console.error);
