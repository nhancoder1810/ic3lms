import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import XPBar from '../components/gamification/XPBar';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import { FaBookOpen, FaClipboardCheck, FaTrophy, FaFire, FaClock } from 'react-icons/fa';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [courseRes, quizRes] = await Promise.all([
          courseService.getEnrolledCourses(),
          quizService.getQuizzes({ limit: 5 }),
        ]);
        setEnrolledCourses(courseRes.courses || courseRes.data || []);
        setQuizzes(quizRes.quizzes || quizRes.data || []);
      } catch (err) {
        console.error('Student dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeHero}>
        <div className={styles.welcomeInfo}>
          <h1 className={styles.heroTitle}>
            Xin chào, <span className={styles.neonName}>{user?.fullName}</span>!
          </h1>
          <p className={styles.heroDesc}>
            Tiếp tục hoàn thành các bài giảng lý thuyết và luyện tập bộ đề IC3 Spark & IC3 GS6 của bạn.
          </p>
        </div>
        <div className={styles.streakCard}>
          <FaFire className={styles.fireIcon} />
          <div className={styles.streakText}>
            <span className={styles.streakDays}>3 Ngày</span>
            <span className={styles.streakLabel}>Chuỗi học tập</span>
          </div>
        </div>
      </div>

      <XPBar level={user?.level || 1} currentXP={user?.points || 0} nextLevelXP={500} />

      <div className={styles.mainGrid}>
        <div className={styles.gridCol}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <FaBookOpen className={styles.headerIcon} />
              <h3>Khóa học đang tham gia</h3>
            </div>
            <Link to="/courses" className={styles.viewAll}>
              Xem tất cả
            </Link>
          </div>

          <div className={styles.courseCards}>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div key={course._id} className={styles.courseCard}>
                  <img src={course.thumbnail} alt={course.title} className={styles.thumb} />
                  <div className={styles.courseDetails}>
                    <span className={`badge-tag ${course.category === 'ic3-spark' ? 'badge-spark' : 'badge-gs6'}`}>
                      {course.category === 'ic3-spark' ? 'IC3 Spark' : 'IC3 GS6'}
                    </span>
                    <h4 className={styles.courseTitle}>{course.title}</h4>
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn-cyber"
                      style={{ marginTop: '8px', padding: '7px 14px', fontSize: '0.84rem' }}
                    >
                      Tiếp tục học
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyCard}>
                <p>Bạn chưa ghi danh khóa học nào.</p>
                <Link to="/courses" className="btn-cyber" style={{ marginTop: '12px' }}>
                  Khám phá khóa học IC3
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={styles.gridCol}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <FaClipboardCheck className={styles.headerIcon} />
              <h3>Đề thi thử & Bài tập ôn luyện</h3>
            </div>
            <Link to="/quizzes" className={styles.viewAll}>
              Xem tất cả
            </Link>
          </div>

          <div className={styles.quizList}>
            {quizzes.map((q) => (
              <div key={q._id} className={styles.quizItem}>
                <div className={styles.quizLeft}>
                  <div className={styles.quizIconWrap}>
                    <FaClipboardCheck />
                  </div>
                  <div>
                    <h5 className={styles.quizName}>{q.title}</h5>
                    <div className={styles.quizMeta}>
                      <span>
                        <FaClock /> {q.timeLimit || 15} phút
                      </span>
                      <span>Điểm đạt: {q.passingScore || 70}%</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/quizzes/${q._id}`}
                  className="btn-neon"
                  style={{ fontSize: '0.82rem', padding: '6px 14px', flexShrink: 0 }}
                >
                  Làm bài
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: '16px' }}>
            <div className={styles.sectionTitle}>
              <FaTrophy className={styles.headerIcon} />
              <h3>Huy hiệu đạt được</h3>
            </div>
            <Link to="/profile" className={styles.viewAll}>
              Hồ sơ
            </Link>
          </div>
          <BadgeDisplay badges={user?.badges || []} />
        </div>
      </div>
    </div>
  );
}
