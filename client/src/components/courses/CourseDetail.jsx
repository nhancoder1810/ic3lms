import React, { useState } from 'react';
import { FiUsers, FiBookOpen, FiClock, FiChevronDown } from 'react-icons/fi';
import Loading from '../common/Loading';
import styles from './CourseDetail.module.css';

const CourseDetail = ({ course, onEnroll, onUnenroll, isEnrolled, loading }) => {
  const [openModules, setOpenModules] = useState({});

  if (loading || !course) return <Loading />;

  const {
    title,
    thumbnail,
    description,
    category,
    teacher,
    modules = [],
    students = [],
    duration,
  } = course;

  const teacherName =
    typeof teacher === 'object' ? teacher.fullName || teacher.username : teacher;

  const isSpark = category === 'ic3-spark';

  const totalLessons = modules.reduce(
    (sum, m) => sum + (m.lessons ? m.lessons.length : 0),
    0
  );

  const toggleModule = (idx) => {
    setOpenModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className={styles.banner}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className={styles.bannerImg} />
        ) : (
          <div className={styles.bannerPlaceholder} />
        )}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <span
          className={`${styles.badge} ${isSpark ? styles.badgeSpark : styles.badgeGs6}`}
        >
          {isSpark ? 'IC3 Spark' : 'IC3 GS6'}
        </span>
        <h1 className={styles.title}>{title}</h1>
        {teacherName && (
          <p className={styles.teacherInfo}>Taught by {teacherName}</p>
        )}
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <FiUsers className={styles.statIcon} />
          <span className={styles.statValue}>{students.length}</span> students
        </div>
        <div className={styles.stat}>
          <FiBookOpen className={styles.statIcon} />
          <span className={styles.statValue}>{totalLessons}</span> lessons
        </div>
        <div className={styles.stat}>
          <FiClock className={styles.statIcon} />
          <span className={styles.statValue}>{duration || '-'}</span>
        </div>
      </div>

      {/* Description */}
      {description && <div className={styles.description}>{description}</div>}

      {/* Modules */}
      {modules.length > 0 && (
        <>
          <h2 className={styles.modulesTitle}>Course Modules</h2>
          {modules.map((mod, idx) => (
            <div key={idx} className={styles.moduleItem}>
              <div
                className={styles.moduleHeader}
                onClick={() => toggleModule(idx)}
              >
                <span className={styles.moduleTitle}>
                  {mod.title || `Module ${idx + 1}`}
                </span>
                <FiChevronDown
                  className={`${styles.chevron} ${
                    openModules[idx] ? styles.chevronOpen : ''
                  }`}
                />
              </div>

              {openModules[idx] && mod.lessons && mod.lessons.length > 0 && (
                <ul className={styles.lessonsList}>
                  {mod.lessons.map((lesson, lIdx) => (
                    <li key={lIdx} className={styles.lessonItem}>
                      <FiBookOpen className={styles.lessonIcon} />
                      {typeof lesson === 'object' ? lesson.title : lesson}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Enroll / Unenroll */}
      {isEnrolled ? (
        <button
          className={styles.unenrollBtn}
          onClick={onUnenroll}
          disabled={loading}
        >
          Unenroll
        </button>
      ) : (
        <button
          className={styles.enrollBtn}
          onClick={onEnroll}
          disabled={loading}
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

export default CourseDetail;
