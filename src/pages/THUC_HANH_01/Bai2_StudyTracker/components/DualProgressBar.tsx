import React from 'react';
import styles from '../index.less';

interface Props {
  targetHours: number;
  actualHours: number;
  color?: string;
  showLabels?: boolean;
}

const DualProgressBar: React.FC<Props> = ({
  targetHours,
  actualHours,
  color = '#6366f1',
  showLabels = true,
}) => {
  if (targetHours <= 0) return null;

  const actualPercent = Math.min(100, (actualHours / targetHours) * 100);
  const isComplete = actualHours >= targetHours;

  return (
    <div>
      <div className={styles.dualProgressContainer}>
        <div
          className={styles.dualProgressTarget}
          style={{ width: '100%' }}
        />
        <div
          className={styles.dualProgressActual}
          style={{
            width: `${actualPercent}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        />
      </div>
      {showLabels && (
        <div className={styles.dualProgressLabels}>
          <span className={styles.dualProgressLabel}>
            {Math.round(actualHours * 10) / 10}h / {targetHours}h
          </span>
          <span className={styles.dualProgressLabel}>
            {Math.round(actualPercent)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default DualProgressBar;
