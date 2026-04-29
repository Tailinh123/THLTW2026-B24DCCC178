import React from 'react';
import { Tag } from 'antd';
import { getBMICategory } from '../utils/calculations';

interface BMITagProps {
  bmi: number;
}

const BMITag: React.FC<BMITagProps> = ({ bmi }) => {
  const { label, color } = getBMICategory(bmi);
  return (
    <Tag color={color} style={{ fontWeight: 600, borderRadius: 4 }}>
      {bmi.toFixed(1)} — {label}
    </Tag>
  );
};

export default BMITag;
