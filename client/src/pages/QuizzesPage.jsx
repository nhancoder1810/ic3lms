import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { FaClipboardCheck, FaClock, FaCheckCircle, FaBookOpen, FaPlay } from 'react-icons/fa';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizService.getQuizzes({ limit: 50 });
        const list = res.quizzes || res.data || [];
        setQuizzes(list);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const filtered = quizzes.filter((q) => {
    if (filterType === 'all') return true;
    if (filterType === 'practice') return q.type === 'practice';
    if (filterType === 'exam') return q.type === 'exam';
    if (filterType === 'ic3-spark') return q.course?.category === 'ic3-spark' || q.title.toLowerCase().includes('spark');
    if (filterType === 'ic3-gs6') return q.course?.category === 'ic3-gs6' || q.title.toLowerCase().includes('gs6');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge-tag badge-gs6" style={{ marginBottom: '8px' }}>
            NGÂN HÀNG ĐỀ THI & BÀI TẬP ÔN LUYỆN
          </span>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
            Trung Tâm Khảo Thí & Luyện Thi IC3 Spark / IC3 GS6
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Hệ thống câu hỏi đa dạng: Trắc nghiệm, Đúng/Sai, Kéo thả ghép cặp, Tự luận ngắn và Mô phỏng thao tác thực tế.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tất cả bộ đề' },
            { key: 'ic3-spark', label: 'IC3 Spark (Tiểu học)' },
            { key: 'ic3-gs6', label: 'IC3 GS6 (Level 1-2-3)' },
            { key: 'practice', label: 'Bài tập ôn luyện' },
            { key: 'exam', label: 'Đề thi thử chuẩn' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                background: filterType === tab.key ? 'var(--accent-primary)' : 'var(--bg-card-alt)',
                color: filterType === tab.key ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Đang tải danh sách bài kiểm tra và đề thi...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((q) => {
            const isExam = q.type === 'exam';
            return (
              <div
                key={q._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '22px',
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge-tag ${isExam ? 'badge-gs6' : 'badge-spark'}`}>
                      {isExam ? 'Đề thi thử chuẩn Certiport' : 'Bài tập ôn luyện'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {q.questions?.length || 5} câu hỏi
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.08rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '8px' }}>
                    {q.title}
                  </h3>

                  {q.course?.title && (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaBookOpen style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <span>{q.course.title}</span>
                    </p>
                  )}
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaClock /> {q.timeLimit || 15} phút
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaCheckCircle style={{ color: 'var(--accent-green)' }} /> Đạt: {q.passingScore || 70}%
                    </span>
                  </div>

                  <Link to={`/quizzes/${q._id}`} className="btn-cyber" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                    <FaPlay style={{ fontSize: '0.7rem' }} /> Làm bài
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
