const mongoose = require('mongoose');
const slugify = require('slugify');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề bài học'],
      trim: true,
    },
    slug: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['theory', 'practice', 'video'],
      default: 'theory',
    },
    attachments: [
      {
        filename: String,
        url: String,
        type: String,
      },
    ],
    order: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

lessonSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);
