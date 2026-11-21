import React, { useState, useEffect, useCallback } from 'react';
import { FiClock } from 'react-icons/fi';
import MultipleChoice from './QuestionTypes/MultipleChoice';
import TrueFalse from './QuestionTypes/TrueFalse';
import DragDrop from './QuestionTypes/DragDrop';
import ShortAnswer from './QuestionTypes/ShortAnswer';
import Simulation from './QuestionTypes/Simulation';
import styles from './QuizTake.module.css';

const questionComponents = {
  'multiple-choice': MultipleChoice,
  'true-false': TrueFalse,
  'drag-drop': DragDrop,
  'short-answer': ShortAnswer,
  simulation: Simulation,
};

const questionTypeLabels = {
  'multiple-choice': 'Câu hỏi Trắc nghiệm',
  'true-false': 'Câu hỏi Đúng / Sai',
  'drag-drop': 'Kéo thả & Sắp xếp thứ tự',
  'short-answer': 'Câu trả lời ngắn',
  simulation: 'Mô phỏng thao tác thực tế',
};

const QuizTake = ({ quiz, onSubmit }) => {
  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const timeLimit = quiz?.timeLimit ? quiz.timeLimit * 60 : 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!timeLimit) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit]);

  const handleAnswer = useCallback(
    (value) => {
      setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
    },
    [currentIndex]
  );

  const handleSubmit = () => {
    const formatted = questions.map((q, i) => ({
      question: q._id,
      selectedOption: answers[i] ?? null,
    }));
    onSubmit && onSubmit(formatted);
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const timerPercent = timeLimit ? (timeLeft / timeLimit) * 100 : 100;
  const isDanger = timeLimit && timerPercent < 20;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const QuestionComponent = questionComponents[currentQuestion.questionType];
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className={styles.container}>
      {timeLimit > 0 && (
        <div className={styles.timerBarWrapper}>
          <div
            className={`${styles.timerBar} ${isDanger ? styles.timerBarDanger : ''}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.qBadgeWrap}>
          <span className="badge-tag badge-gs6">
            {questionTypeLabels[currentQuestion.questionType] || 'Câu hỏi'}
          </span>
          <span className={styles.pointsTag}>{currentQuestion.points || 10} điểm</span>
        </div>
        {timeLimit > 0 && (
          <span className={`${styles.timerText} ${isDanger ? styles.timerTextDanger : ''}`}>
            <FiClock />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Question Number Pills */}
      <div className={styles.questionDots}>
        {questions.map((_, idx) => {
          const isAnswered = answers[idx] !== undefined && answers[idx] !== null && answers[idx] !== '';
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`${styles.dotBtn} ${idx === currentIndex ? styles.dotActive : ''} ${
                isAnswered ? styles.dotAnswered : ''
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className={styles.progress}>
        Câu hỏi {currentIndex + 1} / {totalQuestions}
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className={styles.questionArea}>
        <div className={styles.questionText}>{currentQuestion.questionText}</div>
        {QuestionComponent && (
          <QuestionComponent
            question={currentQuestion}
            selectedAnswer={answers[currentIndex]}
            answer={answers[currentIndex]}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      <div className={styles.navigation}>
        <button
          className="btn-neon"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          ← Câu trước
        </button>
        <div className={styles.spacer} />
        {isLast ? (
          <button className="btn-cyber" onClick={handleSubmit}>
            Nộp bài & Xem kết quả
          </button>
        ) : (
          <button
            className="btn-cyber"
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={isLast}
          >
            Câu tiếp theo →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTake;
