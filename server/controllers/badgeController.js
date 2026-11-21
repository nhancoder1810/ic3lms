const Badge = require('../models/Badge');
const User = require('../models/User');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
exports.getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find().sort('condition');
    res.json({ success: true, count: badges.length, badges });
  } catch (error) {
    next(error);
  }
};

// @desc    Award badge to user
// @route   POST /api/badges/award
// @access  Private/Admin,Teacher
exports.awardBadge = async (req, res, next) => {
  try {
    const { badgeId, userId } = req.body;

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy huy hiệu' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Check if user already has this badge
    const alreadyHas = user.badges.some(
      (b) => b.badge.toString() === badgeId
    );

    if (alreadyHas) {
      return res.status(400).json({ success: false, message: 'Người dùng đã có huy hiệu này' });
    }

    user.badges.push({ badge: badge._id, earnedAt: new Date() });
    user.points += badge.points;
    user.level = Math.floor(user.points / 100) + 1;
    await user.save();

    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      user: userId,
      type: 'badge',
      title: 'Huy hiệu mới!',
      message: `Bạn đã nhận được huy hiệu "${badge.name}"`,
      link: '/badges',
    });

    res.json({ success: true, message: 'Đã trao huy hiệu', badge, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/badges/user/:userId
// @access  Private
exports.getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('badges fullName username')
      .populate('badges.badge');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({ success: true, badges: user.badges });
  } catch (error) {
    next(error);
  }
};
