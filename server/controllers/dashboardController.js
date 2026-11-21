const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await QuizAttempt.countDocuments();

    // Recent users
    const recentUsers = await User.find()
      .select('username fullName email role createdAt')
      .sort('-createdAt')
      .limit(5);

    // Active courses (most enrolled)
    const popularCourses = await Course.find({ isPublished: true })
      .select('title category students')
      .sort('-students')
      .limit(5);

    // Category distribution
    const sparkCourses = await Course.countDocuments({ category: 'ic3-spark' });
    const gs6Courses = await Course.countDocuments({ category: 'ic3-gs6' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        publishedCourses,
        totalLessons,
        totalQuizzes,
        totalAttempts,
        categories: { 'ic3-spark': sparkCourses, 'ic3-gs6': gs6Courses },
      },
      recentUsers,
      popularCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher dashboard stats
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
exports.getTeacherStats = async (req, res, next) => {
  try {
    const myCourses = await Course.find({ teacher: req.user._id })
      .select('title category students isPublished modules')
      .populate('students', 'fullName');

    const courseIds = myCourses.map((c) => c._id);

    const totalStudents = new Set();
    myCourses.forEach((c) => c.students.forEach((s) => totalStudents.add(s._id.toString())));

    const totalLessons = await Lesson.countDocuments({ course: { $in: courseIds } });
    const totalQuizzes = await Quiz.countDocuments({ course: { $in: courseIds } });

    // Recent quiz attempts
    const quizzes = await Quiz.find({ course: { $in: courseIds } }).select('_id');
    const quizIds = quizzes.map((q) => q._id);
    const recentAttempts = await QuizAttempt.find({ quiz: { $in: quizIds } })
      .populate('student', 'fullName')
      .populate('quiz', 'title')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalCourses: myCourses.length,
        totalStudents: totalStudents.size,
        totalLessons,
        totalQuizzes,
      },
      courses: myCourses,
      recentAttempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student progress overview
// @route   GET /api/dashboard/student
// @access  Private/Student
exports.getStudentProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title slug category thumbnail modules')
      .populate('badges.badge');

    // Get all quiz attempts
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('quiz', 'title course type')
      .sort('-createdAt');

    // Calculate overall stats
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const averageScore = totalAttempts > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / totalAttempts
        )
      : 0;

    // Per-course progress
    const courseProgress = [];
    for (const course of user.enrolledCourses) {
      const progress = user.progress.get(course._id.toString()) || {
        completedLessons: [],
        completedQuizzes: [],
        percentage: 0,
      };

      let totalLessons = 0;
      course.modules.forEach((mod) => {
        totalLessons += mod.lessons.length;
      });

      courseProgress.push({
        course: {
          _id: course._id,
          title: course.title,
          slug: course.slug,
          category: course.category,
          thumbnail: course.thumbnail,
        },
        completedLessons: progress.completedLessons ? progress.completedLessons.length : 0,
        totalLessons,
        percentage: progress.percentage || 0,
      });
    }

    res.json({
      success: true,
      user: {
        fullName: user.fullName,
        points: user.points,
        level: user.level,
        badges: user.badges,
      },
      stats: {
        enrolledCourses: user.enrolledCourses.length,
        totalAttempts,
        passedAttempts,
        averageScore,
      },
      courseProgress,
      recentAttempts: attempts.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
