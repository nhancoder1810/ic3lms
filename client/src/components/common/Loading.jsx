import React from 'react';

export default function Loading({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      color: 'var(--accent-cyan)',
      gap: '16px',
      fontFamily: 'var(--font-heading)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(0, 212, 255, 0.2)',
        borderTop: '3px solid var(--accent-cyan)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <span style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
