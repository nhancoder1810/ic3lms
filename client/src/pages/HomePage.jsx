import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMonitor, FiAward, FiUsers, FiArrowRight, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import CourseCard from '../components/courses/CourseCard';
import Loading from '../components/common/Loading';
import courseService from '../services/courseService';
import styles from './HomePage.module.css';

const features = [
  {
    icon: <FiMonitor />,
    title: 'Giáo Trình Chuẩn Certiport',
    description:
      'Hệ thống bài giảng lý thuyết & thực hành bám sát khung năng lực Tin học quốc tế IC3 Spark (Tiểu học) và IC3 GS6 (Level 1, 2, 3).',
  },
  {
    icon: <FiBookOpen />,
    title: '5 Dạng Câu Hỏi Khảo Thí',
    description:
      'Làm bài ôn tập và đề thi thử với đầy đủ dạng câu hỏi: Trắc nghiệm, Đúng/Sai, Kéo thả ghép cặp, Tự luận ngắn và Mô phỏng thao tác.',
  },
  {
    icon: <FiAward />,
    title: 'Theo Dõi Tiến Độ & Thành Tích',
    description:
      'Tích lũy điểm học tập, theo dõi phần trăm hoàn thành khóa học, nhận huy hiệu chứng nhận và thi đua trên bảng xếp hạng.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses({ limit: 6 });
        setCourses(res.courses || res.data?.courses || res.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className={styles.home}>
      {/* Clean Modern LMS Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>
            <FiCheckCircle /> Hệ thống Học tập & Luyện thi Tin học Quốc tế
          </span>
          <h1 className={styles.heroTitle}>
            Nền tảng Học tập Trực tuyến <span className={styles.highlight}>IC3 Spark & IC3 GS6</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Học lý thuyết trực quan theo từng chuyên đề, rèn luyện kỹ năng số qua bài tập tương tác và chinh phục các đề thi thử chuẩn Certiport ngay trên trình duyệt.
          </p>
          <div className={styles.heroActions}>
            <button className="btn-cyber" onClick={() => navigate('/courses')}>
              Khám phá Khóa học <FiArrowRight />
            </button>
            <button className="btn-neon" onClick={() => navigate('/quizzes')}>
              Luyện Đề Thi Thử
            </button>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <strong>4+</strong>
              <span>Khóa học IC3 Spark & GS6</span>
            </div>
            <div className={styles.statItem}>
              <strong>15+</strong>
              <span>Bài giảng Lý thuyết & Thực hành</span>
            </div>
            <div className={styles.statItem}>
              <strong>7+</strong>
              <span>Bộ đề ôn tập & Thi thử</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderCenter}>
          <h2 className={styles.sectionTitle}>Tính năng Học tập & Quản lý Toàn diện</h2>
          <p className={styles.sectionSub}>
            Thiết kế tối ưu cho Học sinh, Giáo viên và Nhà trường trong giảng dạy môn Tin học quốc tế
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feat, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feat.icon}</div>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>Chương trình Học IC3 Tiêu biểu</h2>
            <p className={styles.sectionSub}>Chọn cấp độ phù hợp để bắt đầu học lý thuyết và làm bài tập</p>
          </div>
          <Link to="/courses" className="btn-neon">
            Xem tất cả khóa học <FiArrowRight />
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onClick={(c) => navigate(`/courses/${c._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
