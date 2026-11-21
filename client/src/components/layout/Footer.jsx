import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © 2026 <strong>IC3 Academy LMS</strong> - Hệ thống Quản lý Học tập & Ôn luyện Tin học Quốc tế IC3 Spark & IC3 GS6.
        </p>
        <p className={styles.tags}>
          <span>Chuẩn Certiport / IIG Việt Nam</span> • <span>Lý thuyết & Thực hành Mô phỏng</span> • <span>Hỗ trợ Giao diện Sáng / Tối</span>
        </p>
      </div>
    </footer>
  );
}
