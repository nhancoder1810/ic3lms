const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitAttempt,
  getAttempts,
  getQuizResults,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/attempts', protect, getAttempts);

router
  .route('/')
  .get(getQuizzes)
  .post(protect, authorize('admin', 'teacher'), createQuiz);

router
  .route('/:id')
  .get(getQuiz)
  .put(protect, authorize('admin', 'teacher'), updateQuiz)
  .delete(protect, authorize('admin', 'teacher'), deleteQuiz);

router.post('/:id/submit', protect, submitAttempt);
router.get('/:id/results', protect, getQuizResults);

module.exports = router;
