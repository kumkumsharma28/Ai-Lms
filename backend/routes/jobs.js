// routes/jobs.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createJob, getAllJobs, getMyJobs, deleteJob } = require('../controllers/jobController');

router.use(protect);
router.get('/', getAllJobs);
router.post('/', authorize('recruiter'), createJob);
router.get('/mine', authorize('recruiter'), getMyJobs);
router.delete('/:id', authorize('recruiter'), deleteJob);

module.exports = router;
