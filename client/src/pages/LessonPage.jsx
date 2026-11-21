import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { FaCheckCircle, FaArrowLeft, FaClipboardCheck, FaClock } from 'react-icons/fa';
import styles from './LessonPage.module.css';

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await lessonService.getLesson(id);
        const lessonData = res.lesson || res.data;
        if (lessonData) {
          setLesson(lessonData);
        }
      } catch (err) {
        console.error('Fetch lesson error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleMarkComplete = async () => {
    try {
      const res = await lessonService.markComplete(id);
      if (res.success) {
        setCompleted(true);
      }
    } catch (err) {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
        Đang tải nội dung bài giảng...
      </div>
    );
  }
  if (!lesson) {
    return (
      <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '60px' }}>
        Không tìm thấy bài học
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link
        to={lesson.course ? `/courses/${lesson.course._id || lesson.course}` : '/courses'}
        className={styles.backLink}
      >
        <FaArrowLeft /> Quay lại khóa học: {lesson.course?.title || 'Danh sách'}
      </Link>

      <div className={styles.contentCard}>
        <div className={styles.header}>
          <span className="badge-tag badge-gs6">
            Chuyên đề {lesson.module || 1} • {lesson.type === 'practice' ? 'Thực hành thao tác' : 'Lý thuyết trọng tâm'}
          </span>
          <h1 className={styles.title}>{lesson.title}</h1>
          <div className={styles.meta}>
            <span>
              <FaClock /> Thời lượng đọc & thực hành: {lesson.duration || 30} phút
            </span>
          </div>
        </div>

        {/* Lesson Rich Content */}
        <div className={styles.lessonBody} dangerouslySetInnerHTML={{ __html: lesson.content }} />

        {/* Completion Action */}
        <div className={styles.footerAction}>
          {completed ? (
            <div className={styles.completedAlert}>
              <FaCheckCircle className={styles.checkIcon} />
              <div>
                <strong>Bạn đã hoàn thành bài học này!</strong>
                <p>Điểm thưởng +10 XP đã được ghi nhận vào tiến độ học tập.</p>
              </div>
            </div>
          ) : (
            <button onClick={handleMarkComplete} className="btn-cyber">
              <FaCheckCircle /> Đánh dấu đã học xong bài này (+10 XP)
            </button>
          )}
        </div>
      </div>

      {/* Related Quizzes */}
      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <div className={styles.quizSection}>
          <h3 className={styles.quizSectionTitle}>
            <FaClipboardCheck /> Bài tập Ôn luyện & Đề thi thử liên quan
          </h3>
          <div className={styles.quizGrid}>
            {lesson.quizzes.map((q) => (
              <div key={q._id} className={styles.quizCard}>
                <div>
                  <span className={`badge-tag ${q.type === 'exam' ? 'badge-gs6' : 'badge-spark'}`}>
                    {q.type === 'exam' ? 'Đề thi thử' : 'Bài tập ôn luyện'}
                  </span>
                  <h4 className={styles.quizName}>{q.title}</h4>
                  <span className={styles.quizMeta}>
                    Thời gian: {q.timeLimit || 15} phút • Điểm đạt: {q.passingScore || 70}%
                  </span>
                </div>
                <Link to={`/quizzes/${q._id}`} className="btn-cyber" style={{ fontSize: '0.84rem', padding: '7px 14px' }}>
                  Làm bài ngay
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
