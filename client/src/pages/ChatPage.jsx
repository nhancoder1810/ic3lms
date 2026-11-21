import React, { useState, useEffect } from 'react';
import ChatRoom from '../components/chat/ChatRoom';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { FaComments, FaLayerGroup, FaPlus, FaChalkboardTeacher, FaCircle } from 'react-icons/fa';

const DEFAULT_ROOMS = [
  {
    id: 'general',
    name: 'Thảo luận chung',
    description: 'Kênh thông báo lịch học, chia sẻ tài liệu và giao lưu học viên toàn trung tâm',
    badge: 'Chung',
  },
  {
    id: 'ic3-spark',
    name: 'Lớp IC3 Spark (Tiểu học - 12 Buổi)',
    description: 'Hỏi đáp bài tập Máy tính căn bản, Các ứng dụng chủ chốt & Cuộc sống trực tuyến',
    badge: 'IC3 Spark',
  },
  {
    id: 'ic3-gs6',
    name: 'Lớp IC3 GS6 (Level 1-2-3)',
    description: 'Thảo luận 7 chuyên đề năng lực số & giải đề thi thử IC3 GS6 chuẩn Certiport',
    badge: 'IC3 GS6',
  },
  {
    id: 'hoi-dap-thay-co',
    name: 'Hỏi đáp Giáo viên',
    description: 'Đặt câu hỏi trực tiếp cho giảng viên phụ trách để được giải đáp chi tiết',
    badge: 'Hỗ trợ 24/7',
  },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await chatService.getRooms();
        if (res.success && Array.isArray(res.rooms) && res.rooms.length > 0) {
          setRooms(res.rooms);
        }
      } catch (e) {
        // Fallback to DEFAULT_ROOMS
      }
    };
    loadRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const res = await chatService.createRoom(newRoomName.trim());
      if (res.success && res.room) {
        setRooms((prev) => [...prev, res.room]);
        setCurrentRoom(res.room.id);
      }
    } catch (err) {
      const fallbackRoom = {
        id: newRoomName.trim().toLowerCase().replace(/\s+/g, '-'),
        name: newRoomName.trim(),
        description: 'Nhóm học tập & trao đổi chuyên đề IC3',
        badge: 'Nhóm học tập',
      };
      setRooms((prev) => [...prev, fallbackRoom]);
      setCurrentRoom(fallbackRoom.id);
    } finally {
      setNewRoomName('');
      setShowNewRoom(false);
    }
  };

  const activeRoomInfo = rooms.find((r) => r.id === currentRoom) || DEFAULT_ROOMS[0];

  return (
    <div style={{ maxWidth: '1250px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Left Sidebar: Channels & Online Support */}
      <div
        style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
            >
              <FaLayerGroup /> KÊNH THẢO LUẬN LỚP
            </div>
            {user && (
              <button
                type="button"
                onClick={() => setShowNewRoom(!showNewRoom)}
                style={{
                  background: 'var(--bg-card-alt)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-primary)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaPlus /> Tạo nhóm
              </button>
            )}
          </div>

          {showNewRoom && (
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Tên nhóm học tập..."
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                }}
              />
              <button type="submit" className="btn-cyber" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                Tạo
              </button>
            </form>
          )}

          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => setCurrentRoom(r.id)}
              style={{
                background: currentRoom === r.id ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card-alt)',
                border: `1px solid ${currentRoom === r.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                color: currentRoom === r.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                padding: '11px 13px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.86rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaComments />
                {r.name}
              </span>
            </button>
          ))}
        </div>

        {/* Online Teachers & Students Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChalkboardTeacher style={{ color: 'var(--accent-primary)' }} /> BAN GIẢNG VIÊN & HỖ TRỢ
          </div>
          {[
            { name: 'Thầy Nguyễn Văn An', role: 'Giảng viên IC3 GS6 & Spark', status: 'Đang trực tuyến' },
            { name: 'Trần Minh Quân', role: 'Học viên lớp IC3 GS6', status: 'Đang học bài' },
            { name: 'Lê Thu Trang', role: 'Học viên lớp IC3 Spark', status: 'Đang luyện đề' },
          ].map((member, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
              <FaCircle style={{ color: 'var(--accent-green)', fontSize: '0.55rem', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Room */}
      <div style={{ flex: 1, minWidth: '320px' }}>
        <ChatRoom currentRoom={currentRoom} roomInfo={activeRoomInfo} />
      </div>
    </div>
  );
}
