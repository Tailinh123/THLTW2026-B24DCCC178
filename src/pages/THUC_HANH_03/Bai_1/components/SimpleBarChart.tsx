/* ============================================================
 * SimpleBarChart — Biểu đồ cột đơn giản (Pure CSS)
 * ============================================================ */
import React from 'react';
import { Space, Typography } from 'antd';

const { Text } = Typography;

interface BarData {
  date: string;
  total: number;
  completed: number;
}

interface Props {
  data: BarData[];
}

const SimpleBarChart: React.FC<Props> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.total), 1);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, padding: '0 4px' }}>
        {data.map((d, i) => {
          const totalH = Math.round((d.total / maxVal) * 150);
          const doneH = Math.round((d.completed / maxVal) * 150);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                {d.total > 0 ? d.total : ''}
              </Text>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 150 }}>
                <div
                  className="bb-chart-bar-total"
                  title={`Tổng: ${d.total}`}
                  style={{
                    width: 16, height: totalH,
                    background: '#c7d2fe',
                    minHeight: d.total > 0 ? 6 : 0,
                  }}
                />
                <div
                  className="bb-chart-bar-done"
                  title={`Hoàn thành: ${d.completed}`}
                  style={{
                    width: 16, height: doneH,
                    background: '#6366f1',
                    minHeight: d.completed > 0 ? 6 : 0,
                  }}
                />
              </div>
              <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{d.date}</Text>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingLeft: 4 }}>
        {([['#c7d2fe', 'Tổng'], ['#6366f1', 'Hoàn thành']] as [string, string][]).map(([color, label]) => (
          <Space key={label} size={6}>
            <div style={{ width: 12, height: 12, background: color, borderRadius: 3 }} />
            <Text style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</Text>
          </Space>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;