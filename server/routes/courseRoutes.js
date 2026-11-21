const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enroll,
  unenroll,
  getEnrolledCourses,
  getCourseProgress,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/enrolled', protect, getEnrolledCourses);

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('admin', 'teacher'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'teacher'), updateCourse)
  .delete(protect, authorize('admin', 'teacher'), deleteCourse);

router.post('/:id/enroll', protect, enroll);
router.post('/:id/unenroll', protect, unenroll);
router.get('/:id/progress', protect, getCourseProgress);

module.exports = router;
