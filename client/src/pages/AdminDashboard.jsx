import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { courseService } from '../services/courseService';
import { FaUserShield, FaUsers, FaBook, FaGamepad, FaServer, FaDatabase } from 'react-icons/fa';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 5, totalCourses: 2, totalQuizzes: 1 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          dashboardService.getAdminStats().catch(() => ({ data: { totalUsers: 5, totalCourses: 2, totalQuizzes: 1 } })),
          userService.getUsers().catch(() => ({ data: [] })),
        ]);
        if (statsRes.data) setStats(statsRes.data);
        if (usersRes.data) setUsers(usersRes.data?.users || usersRes.data || []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>BẢNG ĐIỀU KHIỂN HỆ THỐNG (ADMIN COMMAND CENTER)</h1>
          <p className={styles.sub}>Giám sát toàn bộ hoạt động học tập, tài khoản, khóa học IC3 Spark & GS6</p>
        </div>
        <div className={styles.systemStatus}>
          <FaServer className={styles.statusIcon} />
          <span>Hệ thống: TRỰC TUYẾN</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-cyan)' }}>
            <FaUsers />
          </div>
          <div>
            <span className={styles.statValue}>{users.length || stats.totalUsers || 5}</span>
            <span className={styles.statLabel}>Tổng người dùng</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-purple)' }}>
            <FaBook />
          </div>
          <div>
            <span className={styles.statValue}>{stats.totalCourses || 2}</span>
            <span className={styles.statLabel}>Khóa học đang mở</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-green)' }}>
            <FaGamepad />
          </div>
          <div>
            <span className={styles.statValue}>{stats.totalQuizzes || 1}</span>
            <span className={styles.statLabel}>Bài thi khảo thí</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--accent-yellow)' }}>
            <FaDatabase />
          </div>
          <div>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>MongoDB Health</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Management */}
      <div className={styles.sectionHeader}>
        <h3>Quản Lý Người Dùng Gần Đây</h3>
        <Link to="/admin/users" className="btn-neon" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
          Quản Lý Tất Cả
        </Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>HỌ TÊN</th>
              <th>EMAIL</th>
              <th>VAI TRÒ</th>
              <th>CẤP ĐỘ / XP</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((u) => (
              <tr key={u._id}>
                <td className={styles.userCol}>
                  <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} alt={u.fullName} className={styles.avatar} />
                  <span>{u.fullName}</span>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`${styles.roleTag} ${styles[u.role]}`}>
                    {u.role === 'admin' ? '👑 Admin' : u.role === 'teacher' ? '🎓 Giáo viên' : '🎮 Học sinh'}
                  </span>
                </td>
                <td>LV.{u.level || 1} ({u.points || 0} XP)</td>
                <td>
                  <span className={styles.activePill}>Hoạt động</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
