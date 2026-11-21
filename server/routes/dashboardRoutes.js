const express = require('express');
const router = express.Router();
const {
  getStats,
  getTeacherStats,
  getStudentProgress,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/admin', authorize('admin'), getStats);
router.get('/teacher', authorize('admin', 'teacher'), getTeacherStats);
router.get('/student', getStudentProgress);

module.exports = router;
