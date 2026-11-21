import React from 'react';
import styles from './BadgeDisplay.module.css';

export default function BadgeDisplay({ badges = [] }) {
  if (!badges || badges.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Chưa mở khóa huy hiệu nào. Hãy hoàn thành bài kiểm tra và khóa học để nhận thưởng!</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {badges.map((item, idx) => {
        const badge = item?.badge || item;
        return (
          <div key={badge?._id || item?._id || idx} className={styles.card}>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>{badge?.icon || '🎖️'}</span>
            </div>
            <div className={styles.info}>
              <h4 className={styles.name}>{badge?.name || 'Huy hiệu IC3'}</h4>
              <p className={styles.desc}>{badge?.description || ''}</p>
              <span className={styles.points}>+{badge?.points || 50} XP</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
