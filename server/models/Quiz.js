const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề bài kiểm tra'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    type: {
      type: String,
      enum: ['practice', 'exam', 'review'],
      default: 'practice',
    },
    timeLimit: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        questionType: {
          type: String,
          enum: ['multiple-choice', 'true-false', 'drag-drop', 'short-answer', 'simulation'],
          default: 'multiple-choice',
        },
        options: [
          {
            text: { type: String },
            isCorrect: { type: Boolean, default: false },
            position: { type: Number },
          },
        ],
        correctAnswer: { type: String },
        explanation: { type: String },
        points: { type: Number, default: 1 },
        mediaUrl: { type: String },
      },
    ],
    attempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizAttempt',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
