// routes/roadmaps.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createRoadmap,
  getMyRoadmaps,
  getRoadmapById,
  updateProgress,
  deleteRoadmap,
} = require('../controllers/roadmapController');

router.use(protect);
router.post('/', authorize('student'), createRoadmap);
router.get('/', authorize('student'), getMyRoadmaps);
router.get('/:id', getRoadmapById);
router.patch('/:id/progress', authorize('student'), updateProgress);
router.delete('/:id', authorize('student'), deleteRoadmap);

module.exports = router;
