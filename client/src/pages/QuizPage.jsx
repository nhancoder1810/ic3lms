import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import QuizTake from '../components/quiz/QuizTake';
import { FaArrowLeft, FaTrophy, FaRedo, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './QuizPage.module.css';

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuiz(id);
        setQuiz(res.quiz || res.data);
      } catch (err) {
        console.error('Fetch quiz error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmitQuiz = async (answers) => {
    try {
      const res = await quizService.submitAttempt(id, answers);
      if (res.success) {
        setResult(res.data || res.attempt);
        return;
      }
    } catch (err) {
      // Grade locally if user is not logged in
      let score = 0;
      let totalPoints = 0;
      const gradedAnswers = (quiz.questions || []).map((q, idx) => {
        totalPoints += q.points || 10;
        const ans = answers[idx]?.selectedOption;
        let isCorrect = false;
        if (q.questionType === 'multiple-choice' || q.questionType === 'simulation') {
          const correctIdx = q.options.findIndex((o) => o.isCorrect);
          isCorrect = ans === correctIdx;
        } else if (q.questionType === 'true-false') {
          const correctOption = q.options.find((o) => o.isCorrect);
          if (ans === 'true' || ans === 'Đúng') {
            isCorrect = correctOption?.text === 'Đúng' || correctOption?.text === 'True';
          } else if (ans === 'false' || ans === 'Sai') {
            isCorrect = correctOption?.text === 'Sai' || correctOption?.text === 'False';
          }
        } else if (q.questionType === 'drag-drop' && Array.isArray(ans)) {
          const expected = [...q.options].sort((a, b) => (a.position || 0) - (b.position || 0)).map((o) => o.text);
          isCorrect = ans.length === expected.length && ans.every((v, i) => v === expected[i]);
        } else if (q.questionType === 'short-answer') {
          isCorrect = String(ans || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase();
        }
        if (isCorrect) score += q.points || 10;
        return { question: q._id, isCorrect, points: isCorrect ? q.points : 0 };
      });
      const pct = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
      setResult({
        score: pct,
        rawScore: score,
        totalPoints,
        passed: pct >= (quiz.passingScore || 70),
        xpEarned: score,
        answers: gradedAnswers,
      });
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
        Đang tải đề kiểm tra...
      </div>
    );
  }
  if (!quiz) {
    return (
      <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '60px' }}>
        Không tìm thấy bài thi
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/quizzes" className={styles.backLink}>
        <FaArrowLeft /> Quay lại ngân hàng đề thi
      </Link>

      {!result ? (
        <div className={styles.quizWrapper}>
          <div className={styles.quizIntro}>
            <span className={`badge-tag ${quiz.type === 'exam' ? 'badge-gs6' : 'badge-spark'}`}>
              {quiz.type === 'exam' ? 'Đề thi thử chuẩn Certiport' : 'Bài tập ôn luyện'}
            </span>
            <h1 className={styles.title}>{quiz.title}</h1>
            <p className={styles.introDesc}>
              Thời gian làm bài: {quiz.timeLimit || 15} phút • Điểm đạt yêu cầu: {quiz.passingScore || 70}% • Tổng số câu: {quiz.questions?.length || 0} câu
            </p>
          </div>
          <QuizTake quiz={quiz} onSubmit={handleSubmitQuiz} />
        </div>
      ) : (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.trophyWrap}>
              <FaTrophy className={styles.trophyIcon} />
            </div>
            <h2 className={styles.resultTitle}>
              {result.passed ? 'Chúc mừng! Bạn đã vượt qua bài kiểm tra' : 'Bạn chưa đạt mức điểm yêu cầu'}
            </h2>
            <p className={styles.resultSub}>
              {result.passed
                ? 'Bạn đã nắm vững các kiến thức và kỹ năng số trong chuyên đề IC3 này.'
                : 'Hãy ôn tập lại phần lý thuyết và thử làm lại đề thi để đạt điểm cao hơn nhé!'}
            </p>
          </div>

          <div className={styles.scoreCircle}>
            <span className={styles.scoreVal}>{result.score ?? 0}%</span>
            <span className={styles.scoreLabel}>Kết quả bài làm</span>
          </div>

          <div className={styles.resultRewards}>
            <div className={styles.rewardPill}>
              +{result.xpEarned || 0} điểm tích lũy (XP)
            </div>
            <div className={result.passed ? styles.badgePill : styles.failPill}>
              {result.passed ? 'Đạt chuẩn (PASS)' : `Cần đạt tối thiểu ${quiz.passingScore || 70}%`}
            </div>
          </div>

          {/* Detailed breakdown */}
          {result.answers && (
            <div className={styles.breakdownList}>
              <h3 className={styles.breakdownTitle}>Chi tiết kết quả từng câu hỏi</h3>
              {quiz.questions?.map((q, idx) => {
                const ans = result.answers[idx];
                const isCorrect = ans?.isCorrect;
                return (
                  <div key={q._id || idx} className={styles.breakdownItem}>
                    <div className={styles.breakdownTop}>
                      <span className={isCorrect ? styles.correctTag : styles.wrongTag}>
                        {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                        {isCorrect ? 'Chính xác' : 'Chưa đúng'}
                      </span>
                      <span className={styles.qPoints}>+{ans?.points || 0}/{q.points} điểm</span>
                    </div>
                    <p className={styles.qText}>{q.questionText}</p>
                    {(ans?.explanation || q.explanation) && (
                      <p className={styles.qExplanation}>
                        <strong>Giải thích:</strong> {ans?.explanation || q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.actionBtns}>
            <button onClick={() => setResult(null)} className="btn-neon">
              <FaRedo /> Làm lại đề này
            </button>
            <Link to="/quizzes" className="btn-cyber">
              Chọn đề ôn luyện khác
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
