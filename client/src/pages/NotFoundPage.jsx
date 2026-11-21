import React from 'react';
import { Link } from 'react-router-dom';
import { FaGhost, FaHome } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <FaGhost style={{ fontSize: '4rem', color: 'var(--accent-purple)' }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: '#fff' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Vùng dữ liệu không tồn tại trong đấu trường IC3!</p>
      <Link to="/" className="btn-cyber" style={{ marginTop: '16px' }}>
        <FaHome /> Trở về Trang Chủ
      </Link>
    </div>
  );
}
