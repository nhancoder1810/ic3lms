const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên huy hiệu'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'badge-default.png',
    },
    condition: {
      type: String,
      enum: ['complete-course', 'perfect-score', 'streak-7', 'first-quiz', 'top-leaderboard'],
      required: true,
    },
    requiredValue: {
      type: Number,
      default: 1,
    },
    points: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);
