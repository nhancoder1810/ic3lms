import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import {
  FaCheckCircle,
  FaPlayCircle,
  FaArrowLeft,
  FaGraduationCap,
  FaClipboardCheck,
  FaClock,
} from 'react-icons/fa';
import styles from './CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getCourse(id);
        const courseData = res.course || res.data;
        if (courseData) {
          setCourse(courseData);
          setQuizzes(res.quizzes || courseData.quizzes || []);
          const enrolled = courseData.students?.some((s) => (s._id || s) === user?._id);
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        console.error('Fetch course error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      const res = await courseService.enroll(id);
      if (res.success) {
        setIsEnrolled(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Vui lòng đăng nhập để ghi danh khóa học');
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>
        Đang tải nội dung khóa học...
      </div>
    );
  }
  if (!course) {
    return (
      <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '60px' }}>
        Không tìm thấy khóa học
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/courses" className={styles.backLink}>
        <FaArrowLeft /> Quay lại danh sách khóa học
      </Link>

      <div className={styles.heroCard}>
        <div className={styles.heroContent}>
          <span className={`badge-tag ${course.category === 'ic3-spark' ? 'badge-spark' : 'badge-gs6'}`}>
            {course.category === 'ic3-spark'
              ? 'Chứng chỉ Tiểu học: IC3 Spark'
              : 'Chứng chỉ Quốc tế: IC3 GS6'}
          </span>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.desc}>{course.description}</p>

          <div className={styles.heroActions}>
            {isEnrolled ? (
              <span className={styles.enrolledBadge}>
                <FaCheckCircle /> Đã ghi danh khóa học
              </span>
            ) : (
              <button onClick={handleEnroll} className="btn-cyber">
                <FaGraduationCap /> Ghi danh học miễn phí
              </button>
            )}
          </div>
        </div>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className={styles.bannerThumb} />
        )}
      </div>

      {/* Modules and Lessons Curriculum */}
      <div className={styles.curriculumSection}>
        <h2 className={styles.sectionHeading}>Nội dung Bài giảng Lý thuyết & Thực hành</h2>

        <div className={styles.moduleList}>
          {course.modules?.map((module, mIdx) => (
            <div key={mIdx} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <h3 className={styles.moduleTitle}>{module.title}</h3>
                {module.description && <span className={styles.moduleDesc}>{module.description}</span>}
              </div>

              <div className={styles.lessonsList}>
                {module.lessons?.map((lesson, lIdx) => (
                  <div key={lesson._id || lIdx} className={styles.lessonItem}>
                    <div className={styles.lessonLeft}>
                      <FaPlayCircle className={styles.lessonIcon} />
                      <div>
                        <span className={styles.lessonTitle}>
                          {lesson.title || `Bài học ${lIdx + 1}`}
                        </span>
                        <span className={styles.lessonType}>
                          {lesson.type === 'practice' ? 'Thực hành thao tác' : 'Lý thuyết trọng tâm'} • Thời lượng: {lesson.duration || 30} phút
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="btn-cyber"
                      style={{ fontSize: '0.84rem', padding: '7px 14px' }}
                    >
                      Học bài này
                    </Link>
                  </div>
                ))}
                {(!module.lessons || module.lessons.length === 0) && (
                  <div className={styles.emptyLessons}>Bài giảng đang được cập nhật...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quizzes & Mock Exams for this Course */}
      {quizzes.length > 0 && (
        <div className={styles.curriculumSection}>
          <h2 className={styles.sectionHeading}>Bài tập Ôn luyện & Đề thi thử của Khóa học</h2>
          <div className={styles.quizGrid}>
            {quizzes.map((q) => (
              <div key={q._id} className={styles.quizCard}>
                <div>
                  <span className={`badge-tag ${q.type === 'exam' ? 'badge-gs6' : 'badge-spark'}`}>
                    {q.type === 'exam' ? 'Đề thi thử chuẩn Certiport' : 'Bài tập ôn luyện'}
                  </span>
                  <h4 className={styles.quizTitle}>{q.title}</h4>
                  <div className={styles.quizMeta}>
                    <span>
                      <FaClock /> {q.timeLimit || 15} phút
                    </span>
                    <span>
                      <FaClipboardCheck /> {q.questions?.length || 5} câu hỏi
                    </span>
                    <span>Điểm đạt: {q.passingScore || 70}%</span>
                  </div>
                </div>
                <Link
                  to={`/quizzes/${q._id}`}
                  className="btn-cyber"
                  style={{ width: 'fit-content', fontSize: '0.85rem', padding: '8px 16px' }}
                >
                  Bắt đầu làm bài
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
