import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, StopOutlined } from '@ant-design/icons';
import type { WorkoutStatus, GoalStatus } from '../types';


const WORKOUT_MAP: Record<WorkoutStatus, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleOutlined /> },
  missed: { label: 'Bỏ lỡ', color: 'error', icon: <CloseCircleOutlined /> },
};

export const WorkoutStatusTag: React.FC<{ status: WorkoutStatus }> = ({ status }) => {
  const cfg = WORKOUT_MAP[status];
  return (
    <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: 4 }}>
      {cfg.label}
    </Tag>
  );
};


const GOAL_MAP: Record<GoalStatus, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: 'Đang thực hiện', color: 'processing', icon: <SyncOutlined /> },
  completed: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleOutlined /> },
  failed: { label: 'Thất bại', color: 'error', icon: <StopOutlined /> },
};

export const GoalStatusTag: React.FC<{ status: GoalStatus }> = ({ status }) => {
  const cfg = GOAL_MAP[status];
  return (
    <Tag
      color={cfg.color}
      icon={cfg.icon}
      style={{ borderRadius: 10, fontSize: 11, lineHeight: '18px', padding: '0 8px', margin: 0 }}
    >
      {cfg.label}
    </Tag>
  );
};
