import React from 'react';
import styles from './XPBar.module.css';

export default function XPBar({ level = 1, currentXP = 0, nextLevelXP = 500 }) {
  const percentage = Math.min(Math.round((currentXP % nextLevelXP) / nextLevelXP * 100), 100);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.levelBadge}>
          <span className={styles.levelText}>CẤP ĐỘ</span>
          <span className={styles.levelNum}>{level}</span>
        </div>
        <div className={styles.xpInfo}>
          <span className={styles.xpLabel}>TIẾN TRÌNH CẤP KẾ TIẾP</span>
          <span className={styles.xpValues}>
            {currentXP % nextLevelXP} / {nextLevelXP} XP ({percentage}%)
          </span>
        </div>
      </div>
      <div className={styles.track}>
        <div 
          className={styles.fill} 
          style={{ width: `${percentage}%` }}
        >
          <div className={styles.glowHead} />
        </div>
      </div>
    </div>
  );
}
