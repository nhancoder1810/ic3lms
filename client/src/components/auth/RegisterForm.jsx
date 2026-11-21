import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserGraduate } from 'react-icons/fa';
import styles from './AuthForm.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Đăng ký không thành công');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <FaUserGraduate />
        </div>
        <h2 className={styles.title}>GIA NHẬP ĐẤU TRƯỜNG</h2>
        <p className={styles.subtitle}>Tạo tài khoản học viên IC3 ngay hôm nay</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Họ và tên</label>
          <div className={styles.inputWrap}>
            <FaUser className={styles.fieldIcon} />
            <input
              type="text"
              name="fullName"
              className={styles.input}
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Tên đăng nhập (Username)</label>
          <div className={styles.inputWrap}>
            <FaUser className={styles.fieldIcon} />
            <input
              type="text"
              name="username"
              className={styles.input}
              placeholder="nguyenvana"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <div className={styles.inputWrap}>
            <FaEnvelope className={styles.fieldIcon} />
            <input
              type="email"
              name="email"
              className={styles.input}
              placeholder="vana@example.com"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              className={styles.input}
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Vai trò tham gia</label>
          <select 
            name="role" 
            className={styles.select}
            value={formData.role} 
            onChange={handleChange}
          >
            <option value="student">🎮 Học sinh / Học viên</option>
            <option value="teacher">🎓 Giáo viên hướng dẫn</option>
          </select>
        </div>

        <button type="submit" className="btn-cyber" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'ĐANG KHỞI TẠO...' : 'TẠO TÀI KHOẢN'}
        </button>

        <div className={styles.footer}>
          Đã có tài khoản?{' '}
          <Link to="/login" className={styles.link}>
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </div>
  );
}
