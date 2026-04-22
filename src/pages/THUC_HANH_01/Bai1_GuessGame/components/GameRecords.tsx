import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from '../index.less';

const GameRecords: React.FC = () => {
  const { records } = useSelector((state: RootState) => state.game);

  if (records.gamesPlayed === 0 && records.bestAttempts === null) return null;

  const winRate = records.gamesPlayed > 0
    ? Math.round((records.gamesWon / records.gamesPlayed) * 100)
    : 0;

  return (
    <div className={styles.recordsSection}>
      <div className={styles.recordItem}>
        <span className={styles.recordValue}>
          {records.bestAttempts !== null ? records.bestAttempts : '—'}
        </span>
        <span className={styles.recordLabel}>Kỷ lục</span>
      </div>
      <div className={styles.recordItem}>
        <span className={styles.recordValue}>{records.gamesPlayed}</span>
        <span className={styles.recordLabel}>Đã chơi</span>
      </div>
      <div className={styles.recordItem}>
        <span className={styles.recordValue}>{winRate}%</span>
        <span className={styles.recordLabel}>Thắng</span>
      </div>
    </div>
  );
};

export default GameRecords;
