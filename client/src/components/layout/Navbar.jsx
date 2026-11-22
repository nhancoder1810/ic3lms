import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FaLaptopCode,
  FaSignOutAlt,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaTrophy,
  FaComments,
  FaBookOpen,
  FaClipboardCheck,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaHome,
} from 'react-icons/fa';
import styles from './Navbar.module.css';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <div className={styles.navLeft}>
          {isAuthenticated && (
            <button
              className={styles.menuBtn}
              onClick={toggleSidebar}
              title="Mở/Đóng danh mục điều hướng"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
          <Link to="/" className={styles.brand}>
            <div className={styles.brandIcon}>
              <FaLaptopCode />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>IC3 Academy LMS</span>
              <span className={styles.brandSub}>Tin học Quốc tế IC3 Spark & GS6</span>
            </div>
          </Link>
        </div>

        <nav className={styles.navLinks}>
          <Link
            to="/courses"
            className={`${styles.navLink} ${
              location.pathname.startsWith('/courses') ? styles.navLinkActive : ''
            }`}
          >
            <FaBookOpen /> Khóa học
          </Link>
          <Link
            to="/quizzes"
            className={`${styles.navLink} ${
              location.pathname.startsWith('/quizzes') ? styles.navLinkActive : ''
            }`}
          >
            <FaClipboardCheck /> Đề thi & Ôn luyện
          </Link>
          <Link
            to="/leaderboard"
            className={`${styles.navLink} ${
              location.pathname === '/leaderboard' ? styles.navLinkActive : ''
            }`}
          >
            <FaTrophy /> Bảng xếp hạng
          </Link>
          <Link
            to="/chat"
            className={`${styles.navLink} ${
              location.pathname === '/chat' ? styles.navLinkActive : ''
            }`}
          >
            <FaComments /> Thảo luận
          </Link>
        </nav>

        <div className={styles.navRight}>
          {/* Light / Dark Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            title={theme === 'light' ? 'Chuyển sang Giao diện Tối' : 'Chuyển sang Giao diện Sáng'}
            aria-label="Chuyển giao diện Sáng / Tối"
          >
            {theme === 'light' ? (
              <>
                <FaMoon className={styles.moonIcon} />
                <span className={styles.themeText}>Tối</span>
              </>
            ) : (
              <>
                <FaSun className={styles.sunIcon} />
                <span className={styles.themeText}>Sáng</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <div className={styles.userProfile}>
              <div className={styles.statsPill}>
                <span className={styles.levelTag}>Cấp {user.level || 1}</span>
                <span className={styles.pointsTag}>{user.points || 0} điểm</span>
              </div>

              <div className={styles.avatarWrap} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                  alt={user.fullName}
                  className={styles.avatar}
                />
                <span className={styles.userName}>{user.fullName}</span>
              </div>

              {dropdownOpen && (
                <div className={styles.dropdownMenu} onMouseLeave={() => setDropdownOpen(false)}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.fullName}</p>
                    <p className={styles.dropdownRole}>
                      {user.role === 'admin' && 'Quản trị viên'}
                      {user.role === 'teacher' && 'Giáo viên giảng dạy'}
                      {user.role === 'student' && 'Học sinh / Học viên'}
                    </p>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    to={
                      user.role === 'admin'
                        ? '/admin/dashboard'
                        : user.role === 'teacher'
                        ? '/teacher/dashboard'
                        : '/student/dashboard'
                    }
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {user.role === 'admin' && <FaUserShield />}
                    {user.role === 'teacher' && <FaChalkboardTeacher />}
                    {user.role === 'student' && <FaUserGraduate />}
                    Bảng điều khiển
                  </Link>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUserGraduate /> Hồ sơ cá nhân
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.authButtons}>
                <Link to="/login" className={`btn-neon ${styles.authBtn}`}>
                  Đăng nhập
                </Link>
                <Link to="/register" className={`btn-cyber ${styles.authBtn}`}>
                  Đăng ký
                </Link>
              </div>
              {/* Guest Mobile Menu Trigger (only shown when not logged in on <= 960px) */}
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                title="Mở menu điều hướng"
                aria-label="Mở menu điều hướng"
              >
                {mobileNavOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Guest Mobile Dropdown Navigation Drawer (<= 960px) */}
      {!isAuthenticated && mobileNavOpen && (
        <div className={styles.mobileDrawer}>
          <Link to="/" className={styles.mobileNavLink}>
            <FaHome /> Trang chủ
          </Link>
          <Link to="/courses" className={styles.mobileNavLink}>
            <FaBookOpen /> Khóa học IC3 Spark & GS6
          </Link>
          <Link to="/quizzes" className={styles.mobileNavLink}>
            <FaClipboardCheck /> Đề thi & Ôn luyện
          </Link>
          <Link to="/leaderboard" className={styles.mobileNavLink}>
            <FaTrophy /> Bảng xếp hạng
          </Link>
          <Link to="/chat" className={styles.mobileNavLink}>
            <FaComments /> Phòng thảo luận
          </Link>

          <div className={styles.mobileAuthActions}>
            <Link to="/login" className="btn-neon" style={{ flex: 1 }}>
              Đăng nhập
            </Link>
            <Link to="/register" className="btn-cyber" style={{ flex: 1 }}>
              Đăng ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
