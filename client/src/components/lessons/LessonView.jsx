import React from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiBookOpen } from 'react-icons/fi';
import styles from './LessonView.module.css';

const typeBadgeClass = {
  theory: styles.badgeTheory,
  practice: styles.badgePractice,
  video: styles.badgeVideo,
};

const LessonView = ({
  lesson,
  onComplete,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  isCompleted,
}) => {
  if (!lesson) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{lesson.title}</h2>
          <span className={`${styles.badge} ${typeBadgeClass[lesson.type] || styles.badgeTheory}`}>
            <FiBookOpen size={13} />
            {lesson.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />

      {/* Attachments */}
      {lesson.attachments && lesson.attachments.length > 0 && (
        <div className={styles.attachments}>
          <h4 className={styles.attachmentsTitle}>Attachments</h4>
          <ul className={styles.attachmentList}>
            {lesson.attachments.map((att, idx) => (
              <li key={idx}>
                <a
                  href={att.url || att}
                  className={styles.attachmentItem}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {att.name || att.filename || `Attachment ${idx + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className={styles.navBar}>
        <button
          className={styles.navBtn}
          onClick={onPrev}
          disabled={!hasPrev}
        >
          <FiArrowLeft size={16} />
          Prev
        </button>

        {isCompleted ? (
          <button className={styles.completedBtn} disabled>
            <FiCheck size={16} />
            Completed ✓
          </button>
        ) : (
          <button className={styles.completeBtn} onClick={onComplete}>
            <FiCheck size={16} />
            Mark Complete
          </button>
        )}

        <button
          className={styles.navBtn}
          onClick={onNext}
          disabled={!hasNext}
        >
          Next
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LessonView;
