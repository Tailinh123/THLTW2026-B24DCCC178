import React, { useState, useEffect, useRef } from 'react';
import { Progress } from 'antd';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from '../store';
import GameInput from './components/GameInput';
import GameFeedback from './components/GameFeedback';
import GameHistory from './components/GameHistory';
import GameRecords from './components/GameRecords';
import GameResult from './components/GameResult';
import Confetti from './components/Confetti';
import styles from './index.less';

const GuessGameContent: React.FC = () => {
  const { attemptsLeft, status, history } = useSelector((state: RootState) => state.game);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevHistoryLen = useRef(history.length);

  useEffect(() => {
    const id = 'google-fonts-cyber';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (history.length > prevHistoryLen.current && status === 'playing') {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
    prevHistoryLen.current = history.length;
  }, [history.length, status]);

  useEffect(() => {
    if (status === 'won') {
      setShowConfetti(true);
    }
  }, [status]);

  const getProgressColor = () => {
    if (attemptsLeft >= 7) return '#22c55e';
    if (attemptsLeft >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const cardClasses = [
    styles.gameCard,
    isShaking ? styles.shake : '',
    attemptsLeft <= 2 && status === 'playing' ? styles.warning : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.gameContainer}>
      <div className={cardClasses}>
        {status === 'playing' ? (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>ĐOÁN SỐ BÍ ẨN</h1>
              <p className={styles.subtitle}>Tìm con số bí mật từ 1 đến 100</p>
            </div>

            <div className={styles.progressSection}>
              <Progress
                type="dashboard"
                percent={(attemptsLeft / 10) * 100}
                strokeColor={getProgressColor()}
                trailColor="#e2e8f0"
                strokeWidth={10}
                gapDegree={60}
                width={120}
                format={() => (
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    lineHeight: 1,
                    marginTop: -4
                  }}>
                    {attemptsLeft}
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>
                      lượt còn
                    </span>
                  </span>
                )}
              />
            </div>

            <GameInput />
            <GameFeedback />
            <GameHistory />
            <GameRecords />
          </>
        ) : (
          <GameResult />
        )}
      </div>

      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
    </div>
  );
};

const Bai1Wrapper: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GuessGameContent />
    </PersistGate>
  </Provider>
);

export default Bai1Wrapper;
