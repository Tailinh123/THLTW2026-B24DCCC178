import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getSubjectIcon } from '../constants';
import DualProgressBar from './DualProgressBar';
import EmptyState from './EmptyState';
import moment from 'moment';
import styles from '../index.less';

interface Props {
  onEditCategory: (id: string) => void;
  onAddCategory: () => void;
  actualHoursThisMonth: number;
}

const MonthlyGoal: React.FC<Props> = ({ onEditCategory, onAddCategory, actualHoursThisMonth }) => {
  const { categories, sessions, monthlyGoalHours } = useSelector((state: RootState) => state.study);

  const getSubjectMonthlyHours = (categoryId: string) => {
    return sessions
      .filter((s) => s.categoryId === categoryId && moment(s.date).isSame(moment(), 'month'))
      .reduce((sum, s) => sum + s.durationHours, 0);
  };

  const getGoalStatus = (actual: number, target: number) => {
    if (target <= 0) return 'none';
    if (actual >= target) return 'success';
    return 'pending';
  };

  const getGoalBadgeClass = (status: string) => {
    if (status === 'success') return styles.goalBadgeSuccess;
    if (status === 'pending') return styles.goalBadgePending;
    return styles.goalBadgeNone;
  };

  const getGoalBadgeText = (status: string) => {
    if (status === 'success') return '✓ Đã đạt';
    if (status === 'pending') return 'Đang tiến hành';
    return 'Chưa đặt';
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon="goal"
        title="Chưa có mục tiêu nào"
        subtitle="Hãy thêm môn học trước để thiết lập mục tiêu"
        actionLabel="Thêm Môn Học"
        onAction={onAddCategory}
      />
    );
  }

  const overallStatus = getGoalStatus(actualHoursThisMonth, monthlyGoalHours);

  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Mục tiêu Tháng {moment().format('MM/YYYY')}</span>
      </div>

      <div className={styles.goalSection}>
        <div className={styles.goalCard}>
          <div className={styles.goalCardHeader}>
            <div className={styles.goalCardTitle}>
              🎯 Tổng mục tiêu tháng
            </div>
            <span className={`${styles.goalCardBadge} ${getGoalBadgeClass(overallStatus)}`}>
              {getGoalBadgeText(overallStatus)}
            </span>
          </div>
          <DualProgressBar
            targetHours={monthlyGoalHours}
            actualHours={actualHoursThisMonth}
            color="#6366f1"
          />
        </div>

        {categories.map((cat) => {
          const actual = getSubjectMonthlyHours(cat.id);
          const target = cat.goalHours || 0;
          const status = getGoalStatus(actual, target);

          return (
            <div key={cat.id} className={styles.goalCard}>
              <div className={styles.goalCardHeader}>
                <div className={styles.goalCardTitle}>
                  <span style={{ color: cat.color, fontSize: 18 }}>
                    {getSubjectIcon(cat.icon)}
                  </span>
                  {cat.name}
                </div>
                <span className={`${styles.goalCardBadge} ${getGoalBadgeClass(status)}`}>
                  {target > 0 ? getGoalBadgeText(status) : 'Chưa đặt mục tiêu'}
                </span>
              </div>
              {target > 0 ? (
                <DualProgressBar
                  targetHours={target}
                  actualHours={actual}
                  color={cat.color}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: 13 }}>
                  <a
                    style={{ color: '#818cf8', cursor: 'pointer' }}
                    onClick={() => onEditCategory(cat.id)}
                  >
                    Thiết lập mục tiêu →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyGoal;
