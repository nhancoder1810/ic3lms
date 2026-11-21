import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardCheck,
  FaUsers,
  FaTrophy,
  FaComments,
  FaAward,
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}>
      <div className={styles.sectionTitle}>Không gian học tập</div>
      <nav className={styles.menu}>
        {role === 'admin' && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaTachometerAlt className={styles.icon} />
              <span className={styles.label}>Tổng quan hệ thống</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaUsers className={styles.icon} />
              <span className={styles.label}>Quản lý người dùng</span>
            </NavLink>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaBook className={styles.icon} />
              <span className={styles.label}>Quản lý khóa học</span>
            </NavLink>
          </>
        )}

        {role === 'teacher' && (
          <>
            <NavLink
              to="/teacher/dashboard"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaTachometerAlt className={styles.icon} />
              <span className={styles.label}>Bảng điều khiển GV</span>
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaBook className={styles.icon} />
              <span className={styles.label}>Khóa học & Bài giảng</span>
            </NavLink>
          </>
        )}

        {role === 'student' && (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaTachometerAlt className={styles.icon} />
              <span className={styles.label}>Tổng quan học tập</span>
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
            >
              <FaBook className={styles.icon} />
              <span className={styles.label}>Khóa học IC3</span>
            </NavLink>
          </>
        )}

        <NavLink
          to="/quizzes"
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <FaClipboardCheck className={styles.icon} />
          <span className={styles.label}>Đề thi & Ôn luyện</span>
        </NavLink>

        <div className={styles.sectionTitle}>Cộng đồng & Thành tích</div>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <FaTrophy className={styles.icon} />
          <span className={styles.label}>Bảng xếp hạng</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <FaComments className={styles.icon} />
          <span className={styles.label}>Phòng thảo luận</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <FaAward className={styles.icon} />
          <span className={styles.label}>Hồ sơ & Chứng nhận</span>
        </NavLink>
      </nav>
    </aside>
  );
}
