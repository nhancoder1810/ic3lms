import React from 'react';
import { FiBookOpen, FiUser, FiLayers } from 'react-icons/fi';
import styles from './CourseCard.module.css';

const CourseCard = ({ course, onClick }) => {
  const {
    title,
    description,
    thumbnail,
    teacher,
    category,
    modules = [],
  } = course;

  const teacherName =
    typeof teacher === 'object' ? teacher?.fullName || teacher?.username : teacher;

  const isSpark = category === 'ic3-spark';
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div className={styles.card} onClick={() => onClick && onClick(course)}>
      <div className={styles.thumbWrapper}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.thumbnail} />
        ) : (
          <div className={styles.placeholderThumb}>
            <FiBookOpen className={styles.placeholderIcon} />
          </div>
        )}
        <span className={`badge-tag ${isSpark ? 'badge-spark' : 'badge-gs6'} ${styles.floatingBadge}`}>
          {isSpark ? 'IC3 Spark' : 'IC3 GS6'}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {description && (
          <p className={styles.desc}>
            {description.length > 110 ? `${description.slice(0, 110)}...` : description}
          </p>
        )}

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <FiLayers /> {modules.length || 2} Chuyên đề ({totalLessons || 2} bài học)
          </span>
          {teacherName && (
            <span className={styles.metaItem}>
              <FiUser /> {teacherName}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.ctaText}>Vào học & Ôn tập →</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
