import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaLaptopCode } from 'react-icons/fa';
import styles from './AuthForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const user = res.user;
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'teacher') navigate('/teacher/dashboard');
        else navigate('/student/dashboard');
      } else {
        setError(res.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@ic3lms.edu.vn');
      setPassword('123456');
    } else if (role === 'teacher') {
      setEmail('teacher@ic3lms.edu.vn');
      setPassword('123456');
    } else {
      setEmail('student1@ic3lms.edu.vn');
      setPassword('123456');
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <FaLaptopCode />
        </div>
        <h2 className={styles.title}>Đăng nhập Hệ thống</h2>
        <p className={styles.subtitle}>Học tập & Ôn thi Chứng chỉ Quốc tế IC3 Spark & IC3 GS6</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Địa chỉ Email</label>
          <div className={styles.inputWrap}>
            <FaEnvelope className={styles.fieldIcon} />
            <input
              type="email"
              className={styles.input}
              placeholder="nhap.email@ic3lms.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Mật khẩu</label>
          <div className={styles.inputWrap}>
            <FaLock className={styles.fieldIcon} />
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-cyber"
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        <div className={styles.quickAccess}>
          <span className={styles.quickLabel}>Chọn nhanh tài khoản mẫu (Mật khẩu: 123456):</span>
          <div className={styles.quickBtns}>
            <button type="button" onClick={() => handleQuickLogin('student')} className={styles.quickBtn}>
              Học sinh
            </button>
            <button type="button" onClick={() => handleQuickLogin('teacher')} className={styles.quickBtn}>
              Giáo viên
            </button>
            <button type="button" onClick={() => handleQuickLogin('admin')} className={styles.quickBtn}>
              Quản trị
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className={styles.link}>
            Đăng ký tài khoản mới
          </Link>
        </div>
      </form>
    </div>
  );
}
