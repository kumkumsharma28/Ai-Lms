// controllers/jobController.js
const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createJob = (req, res) => {
  const { position, company, location, experience_level, skills_required, description } = req.body;
  if (!position || !company) return res.status(400).json({ message: 'position and company are required.' });
  const db = getDb();
  const id = uuidv4();
  db.prepare('INSERT INTO jobs (id,recruiter_id,position,company,location,experience_level,skills_required,description) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, position, company, location||null, experience_level||null, skills_required||null, description||null);
  res.status(201).json({ message: 'Job posted.', jobId: id });
};

const getAllJobs  = (req, res) => res.json({ jobs: getDb().prepare('SELECT * FROM jobs ORDER BY created_at DESC').all() });
const getMyJobs   = (req, res) => res.json({ jobs: getDb().prepare('SELECT * FROM jobs WHERE recruiter_id=? ORDER BY created_at DESC').all(req.user.id) });

const deleteJob = (req, res) => {
  const db  = getDb();
  const job = db.prepare('SELECT * FROM jobs WHERE id=?').get(req.params.id);
  if (!job || job.recruiter_id !== req.user.id) return res.status(404).json({ message: 'Not found.' });
  db.prepare('DELETE FROM jobs WHERE id=?').run(req.params.id);
  res.json({ message: 'Deleted.' });
};

module.exports = { createJob, getAllJobs, getMyJobs, deleteJob };
