import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Room, RoomType, ROOM_TYPE_LABELS } from '../../types/room';
import { THEME_TOKENS } from '../../constants';

interface RoomTypeChartProps {
  rooms: Room[];
  onFilterByType?: (type: RoomType) => void;
}

const CHART_COLORS: Record<RoomType, string> = {
  [RoomType.THEORY]: THEME_TOKENS.chartTheory,
  [RoomType.PRACTICE]: THEME_TOKENS.chartPractice,
  [RoomType.HALL]: THEME_TOKENS.chartHall,
};

const RoomTypeChart: React.FC<RoomTypeChartProps> = ({ rooms, onFilterByType }) => {
  const data = Object.values(RoomType)
    .map((type) => ({
      name: ROOM_TYPE_LABELS[type],
      value: rooms.filter((r) => r.type === type).length,
      type,
    }))
    .filter((d) => d.value > 0);

  const handleClick = useCallback(
    (entry: { type: RoomType }) => {
      if (onFilterByType) {
        onFilterByType(entry.type);
      }
    },
    [onFilterByType],
  );

  if (data.length === 0) {
    return (
      <div className="gk-chart-card">
        <div className="gk-chart-card__title">Phân bố loại phòng</div>
        <div className="gk-chart-card__container">
          <span style={{ color: '#94A3B8', fontSize: 14 }}>Chưa có dữ liệu</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gk-chart-card">
      <div className="gk-chart-card__title">Phân bố loại phòng</div>
      <div className="gk-chart-card__subtitle">Nhấn vào biểu đồ để lọc theo loại</div>
      <div className="gk-chart-card__container">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              cursor="pointer"
              onClick={(_, index) => handleClick(data[index])}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.type}
                  fill={CHART_COLORS[entry.type]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} phòng`, name]}
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                fontSize: 13,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span style={{ color: '#64748B', fontSize: 13, cursor: 'pointer' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(RoomTypeChart);
