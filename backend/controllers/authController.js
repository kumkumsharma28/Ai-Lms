// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password || !role)
    return res.status(400).json({ message: 'All fields are required.' });
  if (!['student','teacher','recruiter'].includes(role))
    return res.status(400).json({ message: 'Invalid role.' });

  const db = getDb();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
    return res.status(409).json({ message: 'Email already in use.' });

  const uid  = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(uid, full_name, email, hash, role);

  if (role === 'student')   db.prepare('INSERT INTO student_profiles (id, user_id) VALUES (?,?)').run(uuidv4(), uid);
  if (role === 'teacher')   db.prepare('INSERT INTO teacher_profiles (id, user_id) VALUES (?,?)').run(uuidv4(), uid);
  if (role === 'recruiter') db.prepare('INSERT INTO recruiter_profiles (id, user_id) VALUES (?,?)').run(uuidv4(), uid);

  db.prepare('INSERT INTO activity_log (id, user_id, action, description) VALUES (?,?,?,?)').run(uuidv4(), uid, 'REGISTER', 'Account created.');

  res.status(201).json({ message: 'Registration successful.', token: sign(uid), user: { id: uid, full_name, email, role } });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  const db   = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Invalid email or password.' });

  db.prepare('INSERT INTO activity_log (id, user_id, action, description) VALUES (?,?,?,?)').run(uuidv4(), user.id, 'LOGIN', 'Logged in.');
  res.json({ message: 'Login successful.', token: sign(user.id), user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
};

const getMe = (req, res) => {
  const db   = getDb();
  const { id, role } = req.user;
  let profile;
  if (role === 'student')   profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(id);
  if (role === 'teacher')   profile = db.prepare('SELECT * FROM teacher_profiles WHERE user_id = ?').get(id);
  if (role === 'recruiter') profile = db.prepare('SELECT * FROM recruiter_profiles WHERE user_id = ?').get(id);
  res.json({ user: req.user, profile: profile || null });
};

module.exports = { register, login, getMe };
