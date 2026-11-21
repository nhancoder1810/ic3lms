const express = require('express');
const router = express.Router();
const {
  getBadges,
  awardBadge,
  getUserBadges,
} = require('../controllers/badgeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBadges);
router.get('/user/:userId', getUserBadges);
router.post('/award', protect, authorize('admin', 'teacher'), awardBadge);

module.exports = router;
