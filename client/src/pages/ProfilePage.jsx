import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import XPBar from '../components/gamification/XPBar';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import { FaSave } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [msg, setMsg] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser({ fullName });
    setMsg('Đã cập nhật hồ sơ thành công!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(18px, 3vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
          alt={user?.fullName}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid var(--accent-primary)',
          }}
        />
        <div>
          <h1 style={{ fontSize: '1.45rem', color: 'var(--text-primary)' }}>{user?.fullName}</h1>
          <p style={{ color: 'var(--accent-primary)', fontSize: '0.88rem', fontWeight: 600, marginTop: '4px' }}>
            @{user?.username} • {user?.role?.toUpperCase()}
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block', marginTop: '4px' }}>
            Email: {user?.email}
          </span>
        </div>
      </div>

      <XPBar level={user?.level || 1} currentXP={user?.points || 0} nextLevelXP={500} />

      {msg && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: 'var(--accent-green)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Cập nhật Thông tin Cá nhân
        </h3>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Họ và Tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
              }}
            />
          </div>
          <button type="submit" className="btn-cyber" style={{ width: 'fit-content' }}>
            <FaSave /> Lưu thay đổi
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Huy hiệu & Chứng nhận Học tập
        </h3>
        <BadgeDisplay badges={user?.badges || []} />
      </div>
    </div>
  );
}
