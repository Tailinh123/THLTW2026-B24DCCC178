import React from 'react';
import { Button } from 'antd';
import { TrophyOutlined, FrownOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { resetGame } from '../../store/gameSlice';
import styles from '../index.less';

const MAX_ATTEMPTS = 10;

const GameResult: React.FC = () => {
  const dispatch = useDispatch();
  const { status, attemptsLeft, targetNumber, records, history } = useSelector(
    (state: RootState) => state.game,
  );

  if (status === 'playing') return null;

  const isWon = status === 'won';
  const attemptsUsed = MAX_ATTEMPTS - attemptsLeft;
  const isNewRecord = isWon && records.bestAttempts === attemptsUsed && records.gamesPlayed <= 1
    || (isWon && records.bestAttempts === attemptsUsed && history.length > 0);

  return (
    <div className={styles.resultCard}>
      <span className={`${styles.resultIcon} ${isWon ? styles.resultWonIcon : styles.resultLostIcon}`}>
        {isWon ? <TrophyOutlined /> : <FrownOutlined />}
      </span>

      <h2 className={`${styles.resultTitle} ${isWon ? styles.resultWonTitle : styles.resultLostTitle}`}>
        {isWon ? 'CHIẾN THẮNG!' : 'HẾT LƯỢT!'}
      </h2>

      <p className={styles.resultSubtitle}>
        {isWon
          ? `Bạn đã tìm ra số ${targetNumber} sau ${attemptsUsed} lần thử!`
          : `Số bí mật là ${targetNumber}. Hãy thử lại nhé!`}
      </p>

      {isNewRecord && (
        <div className={styles.newRecordBadge}>🏆 KỶ LỤC MỚI!</div>
      )}

      <div className={styles.resultStats}>
        <div className={styles.resultStatItem}>
          <span className={styles.resultStatValue}>{attemptsUsed}</span>
          <span className={styles.resultStatLabel}>Lần thử</span>
        </div>
        <div className={styles.resultStatItem}>
          <span className={styles.resultStatValue}>
            {records.bestAttempts !== null ? records.bestAttempts : '—'}
          </span>
          <span className={styles.resultStatLabel}>Kỷ lục</span>
        </div>
        <div className={styles.resultStatItem}>
          <span className={styles.resultStatValue}>{records.gamesWon}/{records.gamesPlayed}</span>
          <span className={styles.resultStatLabel}>Thắng/Thua</span>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className={styles.replayButton}
        icon={<ReloadOutlined />}
        onClick={() => dispatch(resetGame())}
      >
        CHƠI LẠI
      </Button>
    </div>
  );
};

export default GameResult;
