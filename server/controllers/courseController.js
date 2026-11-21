const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // For public, show only published
    if (!req.user || req.user.role === 'student') {
      filter.isPublished = true;
    }

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate('teacher', 'fullName avatar')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      courses,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'fullName avatar email')
      .populate('modules.lessons')
      .populate('students', 'fullName avatar');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    const quizzes = await Quiz.find({ course: course._id }).select('-questions.correctAnswer');
    const courseObj = course.toObject();
    courseObj.quizzes = quizzes;

    res.json({ success: true, course: courseObj, quizzes, data: courseObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Teacher,Admin
exports.createCourse = async (req, res, next) => {
  try {
    req.body.teacher = req.user._id;

    if (req.file) {
      req.body.thumbnail = req.file.filename;
    }

    const course = await Course.create(req.body);

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher,Admin
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    // Only owner teacher or admin
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
    }

    if (req.file) {
      req.body.thumbnail = req.file.filename;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    // Delete related lessons
    await Lesson.deleteMany({ course: course._id });

    await course.deleteOne();

    res.json({ success: true, message: 'Đã xóa khóa học' });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enroll = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ success: false, message: 'Khóa học chưa được xuất bản' });
    }

    // Check if already enrolled
    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Bạn đã đăng ký khóa học này' });
    }

    course.students.push(req.user._id);
    await course.save();

    // Add to user's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id },
    });

    res.json({ success: true, message: 'Đăng ký khóa học thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private/Student
exports.unenroll = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    if (!course.students.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Bạn chưa đăng ký khóa học này' });
    }

    course.students = course.students.filter(
      (s) => s.toString() !== req.user._id.toString()
    );
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: course._id },
    });

    res.json({ success: true, message: 'Hủy đăng ký khóa học thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private/Student
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: { path: 'teacher', select: 'fullName avatar' },
    });

    res.json({ success: true, courses: user.enrolledCourses, data: user.enrolledCourses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course progress for a student
// @route   GET /api/courses/:id/progress
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('modules.lessons');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    const user = await User.findById(req.user._id);
    const courseProgress = user.progress.get(req.params.id) || {
      completedLessons: [],
      completedQuizzes: [],
      percentage: 0,
    };

    // Calculate total lessons
    let totalLessons = 0;
    course.modules.forEach((mod) => {
      totalLessons += mod.lessons.length;
    });

    const completedCount = courseProgress.completedLessons
      ? courseProgress.completedLessons.length
      : 0;

    res.json({
      success: true,
      progress: {
        ...courseProgress,
        totalLessons,
        completedLessons: completedCount,
        percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
