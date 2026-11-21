const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get quizzes
// @route   GET /api/quizzes?course=xxx
// @access  Private
exports.getQuizzes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.lesson) filter.lesson = req.query.lesson;
    if (req.query.type) filter.type = req.query.type;

    const total = await Quiz.countDocuments(filter);
    const quizzes = await Quiz.find(filter)
      .populate('course', 'title category')
      .populate('lesson', 'title')
      .select('-questions.correctAnswer -questions.explanation')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    res.json({
      success: true,
      count: quizzes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      quizzes,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public/Private
exports.getQuiz = async (req, res, next) => {
  try {
    let query = Quiz.findById(req.params.id)
      .populate('course', 'title category')
      .populate('lesson', 'title');

    // Hide answers for students
    if (!req.user || req.user.role === 'student') {
      query = query.select('-questions.correctAnswer -questions.explanation');
    }

    const quiz = await query;

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài kiểm tra' });
    }

    res.json({ success: true, quiz, data: quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Teacher,Admin
exports.createQuiz = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền tạo bài kiểm tra' });
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher,Admin
exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài kiểm tra' });
    }

    const course = await Course.findById(quiz.course);
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher,Admin
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài kiểm tra' });
    }

    const course = await Course.findById(quiz.course);
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }

    // Delete related attempts
    await QuizAttempt.deleteMany({ quiz: quiz._id });
    await quiz.deleteOne();

    res.json({ success: true, message: 'Đã xóa bài kiểm tra' });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private/Student
exports.submitAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài kiểm tra' });
    }

    const { answers } = req.body;

    // Grade the quiz
    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = [];

    quiz.questions.forEach((question) => {
      const studentAnswer = answers.find(
        (a) => a.question.toString() === question._id.toString()
      );

      totalPoints += question.points;

      if (studentAnswer && studentAnswer.selectedOption !== null && studentAnswer.selectedOption !== undefined) {
        let isCorrect = false;
        const sel = studentAnswer.selectedOption;

        if (question.questionType === 'multiple-choice' || question.questionType === 'simulation') {
          const correctIndex = question.options.findIndex((o) => o.isCorrect);
          const correctOption = question.options[correctIndex];
          if (typeof sel === 'number') {
            isCorrect = sel === correctIndex;
          } else if (correctOption) {
            isCorrect =
              String(sel) === String(correctIndex) ||
              String(sel) === String(correctOption._id) ||
              String(sel) === String(correctOption.text);
          }
        } else if (question.questionType === 'true-false') {
          const correctIndex = question.options.findIndex((o) => o.isCorrect);
          const correctOption = question.options[correctIndex];
          if (typeof sel === 'number') {
            isCorrect = sel === correctIndex;
          } else if (sel === 'true' || sel === 'Đúng') {
            isCorrect =
              (correctOption && (correctOption.text === 'Đúng' || correctOption.text === 'True')) ||
              question.correctAnswer === 'Đúng' ||
              question.correctAnswer === 'true';
          } else if (sel === 'false' || sel === 'Sai') {
            isCorrect =
              (correctOption && (correctOption.text === 'Sai' || correctOption.text === 'False')) ||
              question.correctAnswer === 'Sai' ||
              question.correctAnswer === 'false';
          } else if (correctOption) {
            isCorrect = String(sel) === String(correctOption._id);
          }
        } else if (question.questionType === 'drag-drop') {
          if (Array.isArray(sel)) {
            const expectedOrder = [...question.options]
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((o) => o.text);
            isCorrect =
              sel.length === expectedOrder.length &&
              sel.every((val, idx) => val === expectedOrder[idx]);
          }
        } else if (question.questionType === 'short-answer') {
          isCorrect =
            String(sel).toLowerCase().trim() ===
            String(question.correctAnswer || '').toLowerCase().trim();
        }

        if (isCorrect) {
          score += question.points;
        }

        gradedAnswers.push({
          question: question._id,
          selectedOption: typeof sel === 'object' ? JSON.stringify(sel) : String(sel),
          isCorrect,
          points: isCorrect ? question.points : 0,
          explanation: question.explanation,
        });
      } else {
        gradedAnswers.push({
          question: question._id,
          selectedOption: null,
          isCorrect: false,
          points: 0,
          explanation: question.explanation,
        });
      }
    });

    const passed = totalPoints > 0
      ? (score / totalPoints) * 100 >= quiz.passingScore
      : false;

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      answers: gradedAnswers,
      score,
      totalPoints,
      passed,
      completedAt: new Date(),
    });

    // Add attempt ref to quiz
    quiz.attempts.push(attempt._id);
    await quiz.save();

    // Award points to user
    const user = await User.findById(req.user._id);
    user.points += score;
    user.level = Math.floor(user.points / 100) + 1;

    // Update progress
    const courseId = quiz.course.toString();
    const progress = user.progress.get(courseId) || {
      completedLessons: [],
      completedQuizzes: [],
      percentage: 0,
    };
    if (!progress.completedQuizzes.includes(quiz._id)) {
      progress.completedQuizzes.push(quiz._id);
    }
    user.progress.set(courseId, progress);
    await user.save();

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const resultPayload = {
      _id: attempt._id,
      score: percentage,
      rawScore: score,
      totalPoints,
      passed,
      percentage,
      xpEarned: score,
      answers: gradedAnswers,
      questions: quiz.questions,
    };

    res.status(201).json({
      success: true,
      attempt: resultPayload,
      data: resultPayload,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz attempts
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getAttempts = async (req, res, next) => {
  try {
    const filter = { quiz: req.params.id };

    // Students can only see their own attempts
    if (req.user.role === 'student') {
      filter.student = req.user._id;
    }

    const attempts = await QuizAttempt.find(filter)
      .populate('student', 'fullName username avatar')
      .sort('-createdAt');

    res.json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz results with explanations
// @route   GET /api/quizzes/:id/results/:attemptId
// @access  Private
exports.getQuizResults = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId).populate('student', 'fullName');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy kết quả' });
    }

    // Students can only view their own results
    if (req.user.role === 'student' && attempt.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Không có quyền xem' });
    }

    const quiz = await Quiz.findById(req.params.id);

    res.json({
      success: true,
      quiz: { title: quiz.title, type: quiz.type, passingScore: quiz.passingScore },
      attempt,
      questions: quiz.questions,
    });
  } catch (error) {
    next(error);
  }
};
