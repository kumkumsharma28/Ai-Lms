// controllers/userController.js
const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getProfile = (req, res) => {
  const db = getDb();
  const { id, role } = req.user;
  let profile;
  if (role === 'student')   profile = db.prepare('SELECT * FROM student_profiles WHERE user_id=?').get(id);
  if (role === 'teacher')   profile = db.prepare('SELECT * FROM teacher_profiles WHERE user_id=?').get(id);
  if (role === 'recruiter') profile = db.prepare('SELECT * FROM recruiter_profiles WHERE user_id=?').get(id);
  res.json({ profile: profile || null });
};

const updateProfile = (req, res) => {
  const db = getDb();
  const { id, role } = req.user;

  if (role === 'student') {
    const { last_course, subjects_studied, bio, skills, github_url, linkedin_url } = req.body;
    db.prepare('UPDATE student_profiles SET last_course=?,subjects_studied=?,bio=?,skills=?,github_url=?,linkedin_url=? WHERE user_id=?')
      .run(last_course||null, subjects_studied||null, bio||null, skills||null, github_url||null, linkedin_url||null, id);
  } else if (role === 'teacher') {
    const { expertise, bio, department } = req.body;
    db.prepare('UPDATE teacher_profiles SET expertise=?,bio=?,department=? WHERE user_id=?').run(expertise||null, bio||null, department||null, id);
  } else if (role === 'recruiter') {
    const { company, bio, industry } = req.body;
    db.prepare('UPDATE recruiter_profiles SET company=?,bio=?,industry=? WHERE user_id=?').run(company||null, bio||null, industry||null, id);
  }
  res.json({ message: 'Profile updated.' });
};

const getActivity = (req, res) => {
  const db   = getDb();
  const rows = db.prepare('SELECT * FROM activity_log WHERE user_id=? ORDER BY created_at DESC LIMIT 20').all(req.user.id);
  res.json({ activity: rows });
};

const getAllStudents = (req, res) => {
  const db = getDb();
  const students = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.created_at,
           sp.last_course, sp.subjects_studied, sp.bio, sp.skills
    FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id
    WHERE u.role = 'student' ORDER BY u.created_at DESC`).all();
  res.json({ students });
};

const getStudentPortfolio = (req, res) => {
  const db = getDb();
  const student = db.prepare(`
    SELECT u.id, u.full_name, u.email, u.created_at,
           sp.last_course, sp.subjects_studied, sp.bio, sp.skills, sp.github_url, sp.linkedin_url
    FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id
    WHERE u.id=? AND u.role='student'`).get(req.params.studentId);

  if (!student) return res.status(404).json({ message: 'Student not found.' });

  const roadmaps = db.prepare('SELECT id, subject, title, time_hours, status, created_at FROM roadmaps WHERE user_id=? ORDER BY created_at DESC').all(req.params.studentId);
  res.json({ student, roadmaps });
};

module.exports = { getProfile, updateProfile, getActivity, getAllStudents, getStudentPortfolio };
