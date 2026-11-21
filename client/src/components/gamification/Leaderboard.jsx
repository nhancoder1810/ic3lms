import React from 'react';
import { FaCrown, FaMedal } from 'react-icons/fa';
import styles from './Leaderboard.module.css';

export default function Leaderboard({ users = [] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <FaCrown className={styles.crownIcon} />
          <h3 className={styles.title}>BẢNG VINH DANH CHIẾN BINH IC3</h3>
        </div>
        <span className={styles.subtitle}>Cập nhật theo điểm kinh nghiệm (XP)</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>HẠNG</th>
              <th>HỌC SINH</th>
              <th>CẤP ĐỘ</th>
              <th>HUY HIỆU</th>
              <th>ĐIỂM XP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => {
              const rank = index + 1;
              return (
                <tr 
                  key={u._id || index} 
                  className={`${styles.row} ${rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : rank === 3 ? styles.rank3 : ''}`}
                >
                  <td className={styles.rankCell}>
                    {rank === 1 && <span className={styles.badgeRank1}><FaCrown /> 1</span>}
                    {rank === 2 && <span className={styles.badgeRank2}><FaMedal /> 2</span>}
                    {rank === 3 && <span className={styles.badgeRank3}><FaMedal /> 3</span>}
                    {rank > 3 && <span className={styles.rankNum}>#{rank}</span>}
                  </td>
                  <td className={styles.userCell}>
                    <img 
                      src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} 
                      alt={u.fullName} 
                      className={styles.avatar}
                    />
                    <div className={styles.nameBlock}>
                      <span className={styles.fullName}>{u.fullName}</span>
                      <span className={styles.username}>@{u.username}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.levelBadge}>LV.{u.level || 1}</span>
                  </td>
                  <td>
                    <span className={styles.badgeCount}>
                      🎖️ {u.badges?.length || 0}
                    </span>
                  </td>
                  <td className={styles.pointsCell}>
                    ⚡ {u.points || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
