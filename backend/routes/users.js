// routes/users.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getActivity,
  getAllStudents,
  getStudentPortfolio,
} = require('../controllers/userController');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/activity', getActivity);
router.get('/students', authorize('teacher', 'recruiter'), getAllStudents);
router.get('/students/:studentId/portfolio', authorize('teacher', 'recruiter'), getStudentPortfolio);

module.exports = router;
