const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getStudents,
  getLeaderboard,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/students', protect, authorize('admin', 'teacher'), getStudents);

router
  .route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
