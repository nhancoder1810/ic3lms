import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import {
  FaPaperPlane,
  FaComments,
  FaCircle,
  FaTrash,
  FaSearch,
  FaLightbulb,
  FaChalkboardTeacher,
  FaUserShield,
  FaUserGraduate,
} from 'react-icons/fa';
import styles from './ChatRoom.module.css';

const QUICK_PROMPTS = [
  'Thầy/cô cho em hỏi lộ trình học 12 buổi IC3 như thế nào ạ?',
  'Giải thích giúp em sự khác nhau giữa RAM và ROM trong IC3 Spark với ạ!',
  'Trong đề thi IC3 GS6 Level 2, khi nào chỉnh Contrast và khi nào chỉnh Brightness?',
  'Em muốn xin tài liệu ôn tập 7 chuyên đề IC3 GS6 Level 1 ạ.',
];

export default function ChatRoom({ currentRoom = 'general', roomInfo }) {
  const { user, login } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(currentRoom);
        if (isMounted && res.success) {
          setMessages(res.messages || res.data || []);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMessages();

    if (socket) {
      socket.emit('join_room', currentRoom);

      const handleReceiveMessage = (msg) => {
        if (msg.room === currentRoom) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      };

      const handleUserTyping = ({ userName, isTyping }) => {
        setTypingUser(isTyping ? userName : null);
      };

      socket.on('receive_message', handleReceiveMessage);
      socket.on('user_typing', handleUserTyping);

      return () => {
        isMounted = false;
        socket.emit('leave_room', currentRoom);
        socket.off('receive_message', handleReceiveMessage);
        socket.off('user_typing', handleUserTyping);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [currentRoom, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && user) {
      socket.emit('typing', {
        room: currentRoom,
        userName: user.fullName,
        isTyping: true,
      });

      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing', {
          room: currentRoom,
          userName: user.fullName,
          isTyping: false,
        });
      }, 1500);
    }
  };

  const handleSendMessage = async (e, customText) => {
    if (e) e.preventDefault();
    const textToSend = (customText ?? newMessage).trim();
    if (!textToSend || !user || sending) return;

    setSending(true);
    try {
      const res = await chatService.sendMessage(currentRoom, textToSend);
      if (res.success) {
        const savedMsg = res.message || res.data;
        setMessages((prev) => {
          if (prev.some((m) => m._id === savedMsg._id)) return prev;
          return [...prev, savedMsg];
        });
        if (!customText) setNewMessage('');
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
      if (socket && user) {
        socket.emit('typing', {
          room: currentRoom,
          userName: user.fullName,
          isTyping: false,
        });
      }
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      const res = await chatService.deleteMessage(msgId);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    const email = role === 'teacher' ? 'teacher@ic3lms.edu.vn' : 'student1@ic3lms.edu.vn';
    await login(email, '123456');
  };

  const filteredMessages = messages.filter((m) =>
    !searchQuery
      ? true
      : m.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRoleBadge = (role) => {
    if (role === 'teacher') {
      return (
        <span className={styles.roleTeacher}>
          <FaChalkboardTeacher /> Giảng viên
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className={styles.roleAdmin}>
          <FaUserShield /> Quản trị
        </span>
      );
    }
    return (
      <span className={styles.roleStudent}>
        <FaUserGraduate /> Học viên
      </span>
    );
  };

  return (
    <div className={styles.chatContainer}>
      {/* Room Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <FaComments className={styles.chatIcon} />
            <span>{roomInfo?.name || `Phòng thảo luận #${currentRoom}`}</span>
            {roomInfo?.badge && <span className="badge-tag badge-gs6">{roomInfo.badge}</span>}
          </div>
          {roomInfo?.description && <p className={styles.roomDesc}>{roomInfo.description}</p>}
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm tin nhắn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.statusOnline}>
            <FaCircle className={styles.onlineDot} /> Trực tuyến
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      {user && (
        <div className={styles.promptsBar}>
          <span className={styles.promptLabel}>
            <FaLightbulb /> Gợi ý hỏi nhanh:
          </span>
          <div className={styles.promptChips}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.promptChip}
                onClick={() => handleSendMessage(null, prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className={styles.messagesList}>
        {loading ? (
          <div className={styles.emptyState}>Đang tải lịch sử thảo luận...</div>
        ) : filteredMessages.length === 0 ? (
          <div className={styles.emptyState}>
            Chưa có tin nhắn nào trong kênh này. Hãy gửi câu hỏi hoặc lời chào đầu tiên!
          </div>
        ) : (
          filteredMessages.map((m, idx) => {
            const senderId = m.sender?._id || m.sender;
            const isMe = user && senderId === user._id;
            const canDelete =
              user && (isMe || user.role === 'admin' || user.role === 'teacher');

            return (
              <div
                key={m._id || idx}
                className={`${styles.messageItem} ${isMe ? styles.myMessage : styles.theirMessage}`}
              >
                <img
                  src={
                    m.sender?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender?.username || 'user'}`
                  }
                  alt="avatar"
                  className={styles.msgAvatar}
                />
                <div className={styles.msgContentWrap}>
                  <div className={styles.msgMetaTop}>
                    <span className={styles.senderName}>
                      {isMe ? 'Bạn' : m.sender?.fullName || 'Học viên'}
                    </span>
                    {renderRoleBadge(m.sender?.role)}
                    <span className={styles.msgTime}>
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {canDelete && m._id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(m._id)}
                        className={styles.deleteBtn}
                        title="Xóa tin nhắn"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div className={styles.msgBubble}>{m.message}</div>
                </div>
              </div>
            );
          })
        )}
        {typingUser && (
          <div className={styles.typingIndicator}>
            <em>{typingUser} đang soạn tin nhắn...</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Quick Login Bar */}
      {user ? (
        <form className={styles.inputArea} onSubmit={(e) => handleSendMessage(e)}>
          <input
            type="text"
            className={styles.inputBox}
            placeholder="Nhập câu hỏi, nội dung trao đổi bài học IC3 Spark & GS6..."
            value={newMessage}
            onChange={handleInputChange}
          />
          <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim() || sending}>
            <FaPaperPlane /> <span>Gửi</span>
          </button>
        </form>
      ) : (
        <div className={styles.guestBar}>
          <span>Đăng nhập nhanh để tham gia đặt câu hỏi và thảo luận trực tiếp:</span>
          <div className={styles.guestBtns}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="btn-cyber"
              style={{ padding: '7px 14px', fontSize: '0.84rem' }}
            >
              Vào với tư cách Học sinh
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('teacher')}
              className="btn-neon"
              style={{ padding: '7px 14px', fontSize: '0.84rem' }}
            >
              Vào với tư cách Giáo viên
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
