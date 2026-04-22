import React from 'react';
import { Tooltip } from 'antd';
import { getCapacityColor, getCapacityPercent, getCapacityLabel } from '../../utils/helpers';

interface CapacityBarProps {
  capacity: number;
}

const CapacityBar: React.FC<CapacityBarProps> = ({ capacity }) => {
  const percent = getCapacityPercent(capacity);
  const color = getCapacityColor(capacity);
  const label = getCapacityLabel(capacity);

  return (
    <Tooltip title={`${capacity} chỗ — ${label}`}>
      <div className="gk-capacity-bar">
        <div className="gk-capacity-bar__track">
          <div
            className="gk-capacity-bar__fill"
            style={{
              width: `${percent}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="gk-capacity-bar__value">{capacity}</span>
      </div>
    </Tooltip>
  );
};

export default React.memo(CapacityBar);
