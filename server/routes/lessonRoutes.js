const express = require('express');
const router = express.Router();
const {
  getLessons,
  getLesson,
  getLessonContent,
  createLesson,
  updateLesson,
  deleteLesson,
  markComplete,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getLessons)
  .post(protect, authorize('admin', 'teacher'), createLesson);

router
  .route('/:id')
  .get(getLesson)
  .put(protect, authorize('admin', 'teacher'), updateLesson)
  .delete(protect, authorize('admin', 'teacher'), deleteLesson);

router.get('/:id/content', protect, getLessonContent);
router.post('/:id/complete', protect, markComplete);

module.exports = router;
