import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from '../index.less';

const GameFeedback: React.FC = () => {
  const { lastFeedback, history } = useSelector((state: RootState) => state.game);

  if (!lastFeedback || history.length === 0) return <div className={styles.feedbackSection} />;

  const latestStatus = history[0]?.status;

  const feedbackClass = latestStatus === 'correct'
    ? styles.feedbackCorrect
    : latestStatus === 'high'
      ? styles.feedbackHigh
      : styles.feedbackLow;

  return (
    <div className={styles.feedbackSection}>
      <div className={`${styles.feedbackMessage} ${feedbackClass}`} key={history.length}>
        {latestStatus === 'low' && '↑ '}
        {lastFeedback}
        {latestStatus === 'high' && ' ↓'}
      </div>
    </div>
  );
};

export default GameFeedback;
