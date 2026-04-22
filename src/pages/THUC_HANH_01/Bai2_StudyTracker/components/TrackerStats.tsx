import React, { useState } from 'react';
import { Button, Modal, InputNumber, notification } from 'antd';
import {
  BookOutlined,
  AimOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setMonthlyGoal } from '../../store/studySlice';
import styles from '../index.less';

interface Props {
  actualHoursThisMonth: number;
}

const TrackerStats: React.FC<Props> = ({ actualHoursThisMonth }) => {
  const dispatch = useDispatch();
  const { categories, sessions, monthlyGoalHours } = useSelector((state: RootState) => state.study);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState<number | null>(null);

  const completionPercent = monthlyGoalHours > 0
    ? Math.min(100, Math.round((actualHoursThisMonth / monthlyGoalHours) * 100))
    : 0;

  const handleSaveGoal = () => {
    if (tempGoal !== null && tempGoal >= 0) {
      dispatch(setMonthlyGoal(tempGoal));
      notification.success({ message: 'Đã cập nhật mục tiêu tháng' });
    }
    setIsGoalModalOpen(false);
  };

  const stats = [
    {
      icon: <BookOutlined />,
      iconBg: 'rgba(99, 102, 241, 0.12)',
      iconColor: '#818cf8',
      value: categories.length,
      label: 'Tổng Môn Học',
    },
    {
      icon: <ClockCircleOutlined />,
      iconBg: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#06b6d4',
      value: Math.round(actualHoursThisMonth * 10) / 10,
      label: 'Giờ Học Tháng Này',
      suffix: 'h',
    },
    {
      icon: <AimOutlined />,
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#f59e0b',
      value: monthlyGoalHours,
      label: 'Mục Tiêu (Giờ)',
      suffix: 'h',
      action: (
        <Button
          type="text"
          size="small"
          className={styles.statCardAction}
          icon={<EditOutlined />}
          onClick={() => {
            setTempGoal(monthlyGoalHours);
            setIsGoalModalOpen(true);
          }}
        />
      ),
    },
    {
      icon: <CheckCircleOutlined />,
      iconBg: completionPercent >= 100 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(148, 163, 184, 0.08)',
      iconColor: completionPercent >= 100 ? '#22c55e' : '#94a3b8',
      value: `${completionPercent}%`,
      label: 'Hoàn Thành',
    },
  ];

  return (
    <>
      <div className={styles.statsRow}>
        {stats.map((stat, index) => (
          <div className={styles.statCard} key={index}>
            <div className={styles.statCardHeader}>
              <div
                className={styles.statCardIcon}
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
              {stat.action || null}
            </div>
            <div className={styles.statCardValue}>
              {stat.value}{stat.suffix || ''}
            </div>
            <div className={styles.statCardLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <Modal
        title="Thiết lập Mục tiêu Tháng"
        visible={isGoalModalOpen}
        onOk={handleSaveGoal}
        onCancel={() => setIsGoalModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        wrapClassName={styles.modalDark}
      >
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>
          Đặt tổng số giờ bạn muốn học trong tháng này:
        </p>
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={500}
          value={tempGoal}
          onChange={(v) => setTempGoal(v as number)}
          addonAfter="giờ"
          size="large"
          autoFocus
        />
      </Modal>
    </>
  );
};

export default TrackerStats;
