import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { FaTrash } from 'react-icons/fa';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        if (res.success) {
          setUsers(res.users || res.data || []);
        }
      } catch (err) {
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        alert('Lỗi khi xóa người dùng');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Quản lý Tài khoản Hệ thống</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Danh sách toàn bộ Học sinh, Giáo viên và Quản trị viên
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          overflowX: 'auto',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-alt)' }}>
              <th style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>NGƯỜI DÙNG</th>
              <th style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>EMAIL</th>
              <th style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>VAI TRÒ</th>
              <th style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>ĐIỂM / CẤP ĐỘ</th>
              <th style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                    {u.fullName}
                  </span>
                </td>
                <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                  {u.email}
                </td>
                <td style={{ padding: '13px 18px' }}>
                  <span className="badge-tag badge-gs6">{u.role.toUpperCase()}</span>
                </td>
                <td style={{ padding: '13px 18px', color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                  Cấp {u.level || 1} • {u.points || 0} XP
                </td>
                <td style={{ padding: '13px 18px' }}>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-red)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                      }}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
