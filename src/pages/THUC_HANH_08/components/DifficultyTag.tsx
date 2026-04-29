import React from 'react';
import { Tag } from 'antd';
import type { Difficulty } from '../types';

const DIFF_MAP: Record<Difficulty, { color: string; label: string }> = {
  Beginner: { color: 'green', label: '🟢 Cơ bản' },
  Intermediate: { color: 'orange', label: '🟡 Trung bình' },
  Advanced: { color: 'red', label: '🔴 Nâng cao' },
};

interface DifficultyTagProps {
  difficulty: Difficulty;
}

const DifficultyTag: React.FC<DifficultyTagProps> = ({ difficulty }) => {
  const cfg = DIFF_MAP[difficulty];
  return (
    <Tag color={cfg.color} style={{ borderRadius: 4, fontWeight: 500 }}>
      {cfg.label}
    </Tag>
  );
};

export default DifficultyTag;
