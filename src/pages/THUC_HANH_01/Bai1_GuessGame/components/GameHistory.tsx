import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from '../index.less';

const GameHistory: React.FC = () => {
  const { history } = useSelector((state: RootState) => state.game);

  if (history.length === 0) return null;

  const getBubbleClass = (status: string) => {
    if (status === 'correct') return styles.bubbleCorrect;
    if (status === 'high') return styles.bubbleHigh;
    return styles.bubbleLow;
  };

  const getIcon = (status: string) => {
    if (status === 'correct') return <CheckCircleOutlined className={styles.bubbleIcon} />;
    if (status === 'high') return <ArrowDownOutlined className={styles.bubbleIcon} />;
    return <ArrowUpOutlined className={styles.bubbleIcon} />;
  };

  return (
    <div className={styles.historySection}>
      <span className={styles.historyLabel}>Lịch sử dự đoán</span>
      <div className={styles.historyBubbles}>
        {history.map((h, i) => (
          <div
            key={`${h.guess}-${i}`}
            className={`${styles.bubble} ${getBubbleClass(h.status)}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {getIcon(h.status)}
            <span>{h.guess}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
