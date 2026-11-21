import React, { useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import Loading from '../common/Loading';
import styles from './CourseList.module.css';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả khóa học' },
  { key: 'ic3-spark', label: 'IC3 Spark (Tiểu học)' },
  { key: 'ic3-gs6', label: 'IC3 GS6 (Level 1, 2, 3)' },
];

const CourseList = ({ courses = [], loading, onCourseClick }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory =
        activeCategory === 'all' || c.category === activeCategory;
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (typeof c.teacher === 'object'
          ? (c.teacher.fullName || c.teacher.username || '')
          : c.teacher || ''
        )
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, activeCategory, search]);

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Tìm kiếm khóa học theo tên hoặc nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.filterBtn} ${
                activeCategory === cat.key ? styles.filterBtnActive : ''
              }`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Không tìm thấy khóa học phù hợp</p>
          <p className={styles.emptyText}>
            Vui lòng thử lại với từ khóa hoặc bộ lọc danh mục khác.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((course) => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              onClick={onCourseClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
