const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề khóa học'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả khóa học'],
    },
    category: {
      type: String,
      required: true,
      enum: ['ic3-spark', 'ic3-gs6'],
    },
    thumbnail: {
      type: String,
      default: 'default-course.png',
    },
    modules: [
      {
        title: { type: String, required: true },
        description: { type: String },
        order: { type: Number, required: true },
        lessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
          },
        ],
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug from title
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual: student count
courseSchema.virtual('studentCount').get(function () {
  return this.students ? this.students.length : 0;
});

module.exports = mongoose.model('Course', courseSchema);
