import React from 'react';
import { FiClock, FiCheck } from 'react-icons/fi';
import Loading from '../common/Loading';
import styles from './QuizList.module.css';

const badgeClass = {
  practice: styles.badgePractice,
  exam: styles.badgeExam,
  review: styles.badgeReview,
};

const QuizList = ({ quizzes = [], onQuizClick, loading }) => {
  if (loading) return <Loading />;

  if (!quizzes.length) {
    return <div className={styles.empty}>No quizzes available yet.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quizzes</h2>
      <div className={styles.grid}>
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className={styles.card}
            onClick={() => onQuizClick && onQuizClick(quiz)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{quiz.title}</h3>
              <span className={`${styles.badge} ${badgeClass[quiz.type] || ''}`}>
                {quiz.type}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.metaItem}>
                <FiClock />
                {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
              </span>
              <span className={styles.metaItem}>
                <FiCheck />
                {quiz.questions?.length || 0} questions
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
