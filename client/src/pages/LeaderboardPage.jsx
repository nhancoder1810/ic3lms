import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import Leaderboard from '../components/gamification/Leaderboard';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await userService.getLeaderboard();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error('Fetch leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Leaderboard users={users} />
    </div>
  );
}
