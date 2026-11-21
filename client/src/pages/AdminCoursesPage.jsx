import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        if (res.success) {
          setCourses(res.courses || res.data || []);
        }
      } catch (err) {
        console.error('Fetch courses error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khóa học này?')) {
      try {
        await courseService.deleteCourse(id);
        setCourses(courses.filter((c) => c._id !== id));
      } catch (err) {
        alert('Lỗi khi xóa khóa học');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Quản lý Khóa học & Giáo trình</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Danh sách các khóa học IC3 Spark & IC3 GS6 trong hệ thống
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
              <span className={`badge-tag ${course.category === 'ic3-spark' ? 'badge-spark' : 'badge-gs6'}`}>
                {course.category?.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{course.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
                {course.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                <Link to={`/courses/${course._id}`} className="btn-neon" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    cursor: 'pointer',
                  }}
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
