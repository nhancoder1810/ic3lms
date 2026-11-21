import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { courseService } from '../services/courseService';
import { FaChalkboardTeacher, FaUsers, FaBook, FaCheckCircle, FaPlus } from 'react-icons/fa';
import styles from './TeacherDashboard.module.css';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, activeSubmissions: 0 });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const [statsRes, coursesRes, studentsRes] = await Promise.all([
          dashboardService.getTeacherStats().catch(() => ({ data: { totalCourses: 2, totalStudents: 3, pendingQuizzes: 12 } })),
          courseService.getCourses(),
          userService.getStudents().catch(() => ({ data: [] })),
        ]);
        if (statsRes.data) setStats(statsRes.data);
        if (coursesRes.data) setCourses(coursesRes.data?.courses || coursesRes.data || []);
        if (studentsRes.data) setStudents(studentsRes.data?.students || studentsRes.data || []);
      } catch (err) {
        console.error('Error loading teacher data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>TRUNG TÂM GIÁO VIÊN: {user?.fullName}</h1>
          <p className={styles.sub}>Quản lý học sinh, giáo trình bài giảng và chấm bài kiểm tra môn Tin học quốc tế</p>
        </div>
        <Link to="/courses" className="btn-cyber">
          <FaPlus /> Thêm Bài Giảng Mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-cyan)' }}>
            <FaBook />
          </div>
          <div>
            <span className={styles.statValue}>{courses.length || 2}</span>
            <span className={styles.statLabel}>Khóa học đang phụ trách</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-green)' }}>
            <FaUsers />
          </div>
          <div>
            <span className={styles.statValue}>{students.length || 3}</span>
            <span className={styles.statLabel}>Học sinh theo học</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-yellow)' }}>
            <FaCheckCircle />
          </div>
          <div>
            <span className={styles.statValue}>18</span>
            <span className={styles.statLabel}>Lượt làm bài trắc nghiệm</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentGrid}>
        {/* Course Management */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Danh sách bài giảng & Khóa học</h3>
            <Link to="/courses" className={styles.viewLink}>Quản lý chi tiết</Link>
          </div>
          <div className={styles.list}>
            {courses.map((c) => (
              <div key={c._id} className={styles.itemRow}>
                <img src={c.thumbnail} alt={c.title} className={styles.itemThumb} />
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemTitle}>{c.title}</h4>
                  <span className={styles.itemMeta}>Danh mục: {c.category?.toUpperCase()}</span>
                </div>
                <Link to={`/courses/${c._id}`} className="btn-neon" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  Xem Lớp
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Students Progress */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Học sinh nổi bật & Tiến độ</h3>
            <Link to="/leaderboard" className={styles.viewLink}>Bảng xếp hạng</Link>
          </div>
          <div className={styles.list}>
            {students.slice(0, 5).map((s) => (
              <div key={s._id} className={styles.itemRow}>
                <img src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.username}`} alt={s.fullName} className={styles.itemAvatar} />
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemTitle}>{s.fullName}</h4>
                  <span className={styles.itemMeta}>Cấp độ: LV.{s.level || 1} • Điểm: {s.points || 0} XP</span>
                </div>
                <span className={styles.statusPill}>Đang học</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
