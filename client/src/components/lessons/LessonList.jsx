import React, { useState } from 'react';
import { FiChevronRight, FiCheckCircle, FiCircle } from 'react-icons/fi';
import styles from './LessonList.module.css';

const LessonList = ({
  modules = [],
  currentLessonId,
  onLessonSelect,
  completedLessons = [],
}) => {
  const [expandedModules, setExpandedModules] = useState(() => {
    // Auto-expand the module containing the current lesson
    const expanded = {};
    modules.forEach((mod, idx) => {
      const hasCurrentLesson = mod.lessons?.some(
        (l) => (l._id || l.id) === currentLessonId
      );
      if (hasCurrentLesson) expanded[idx] = true;
    });
    // If none matched, expand the first module
    if (Object.keys(expanded).length === 0 && modules.length > 0) {
      expanded[0] = true;
    }
    return expanded;
  });

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isCompleted = (lessonId) => completedLessons.includes(lessonId);

  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {modules.map((mod, idx) => {
          const isOpen = !!expandedModules[idx];
          return (
            <div key={idx} className={styles.module}>
              <button
                className={styles.moduleHeader}
                onClick={() => toggleModule(idx)}
              >
                <FiChevronRight
                  size={14}
                  className={isOpen ? styles.chevronOpen : styles.chevron}
                />
                <span className={styles.moduleTitle}>{mod.title}</span>
              </button>

              {isOpen && mod.lessons && (
                <ul className={styles.lessonsList}>
                  {mod.lessons.map((lesson) => {
                    const lessonId = lesson._id || lesson.id;
                    const isActive = lessonId === currentLessonId;
                    const done = isCompleted(lessonId);

                    return (
                      <li
                        key={lessonId}
                        className={
                          isActive ? styles.lessonItemActive : styles.lessonItem
                        }
                        onClick={() => onLessonSelect && onLessonSelect(lessonId)}
                      >
                        <span className={styles.statusIcon}>
                          {done ? (
                            <FiCheckCircle
                              size={15}
                              className={styles.completedIcon}
                            />
                          ) : (
                            <FiCircle
                              size={15}
                              className={styles.incompleteIcon}
                            />
                          )}
                        </span>
                        <span className={styles.lessonTitle}>
                          {lesson.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonList;
