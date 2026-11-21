const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get lessons for a course
// @route   GET /api/lessons?course=xxx
// @access  Public
exports.getLessons = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.module) filter.module = req.query.module;
    if (req.query.type) filter.type = req.query.type;

    const lessons = await Lesson.find(filter)
      .populate('course', 'title')
      .sort('module order');

    res.json({ success: true, count: lessons.length, lessons, data: lessons });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title slug teacher category')
      .populate('completedBy', 'fullName');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    const Quiz = require('../models/Quiz');
    const quizzes = await Quiz.find({
      $or: [{ lesson: lesson._id }, { course: lesson.course?._id || lesson.course }],
    }).select('title type timeLimit passingScore lesson');

    const lessonObj = lesson.toObject();
    lessonObj.quizzes = quizzes;

    res.json({ success: true, lesson: lessonObj, data: lessonObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lesson content (rich HTML)
// @route   GET /api/lessons/:id/content
// @access  Private
exports.getLessonContent = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select('title content type attachments duration');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    res.json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Teacher,Admin
exports.createLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    // Verify teacher owns the course
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền thêm bài học' });
    }

    const lesson = await Lesson.create(req.body);

    // Add lesson to course module
    const moduleIndex = course.modules.findIndex((m) => m.order === req.body.module);
    if (moduleIndex !== -1) {
      course.modules[moduleIndex].lessons.push(lesson._id);
      await course.save();
    }

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Teacher,Admin
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    const course = await Course.findById(lesson.course);
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Teacher,Admin
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    const course = await Course.findById(lesson.course);
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }

    // Remove from course module
    course.modules.forEach((mod) => {
      mod.lessons = mod.lessons.filter((l) => l.toString() !== lesson._id.toString());
    });
    await course.save();

    await lesson.deleteOne();

    res.json({ success: true, message: 'Đã xóa bài học' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson complete
// @route   POST /api/lessons/:id/complete
// @access  Private/Student
exports.markComplete = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài học' });
    }

    // Check if already completed
    if (lesson.completedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Bài học đã được hoàn thành' });
    }

    lesson.completedBy.push(req.user._id);
    await lesson.save();

    // Update user progress
    const user = await User.findById(req.user._id);
    const courseId = lesson.course.toString();
    const progress = user.progress.get(courseId) || {
      completedLessons: [],
      completedQuizzes: [],
      percentage: 0,
    };

    progress.completedLessons.push(lesson._id);

    // Calculate percentage
    const course = await Course.findById(courseId).populate('modules.lessons');
    let totalLessons = 0;
    course.modules.forEach((mod) => {
      totalLessons += mod.lessons.length;
    });
    progress.percentage = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    user.progress.set(courseId, progress);

    // Award points
    user.points += 10;
    // Level up every 100 points
    user.level = Math.floor(user.points / 100) + 1;

    await user.save();

    res.json({
      success: true,
      message: 'Hoàn thành bài học',
      progress,
      points: user.points,
      level: user.level,
    });
  } catch (error) {
    next(error);
  }
};
