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
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, padding: '0 4px' }}>
        {data.map((d, i) => {
          const totalH = Math.round((d.total / maxVal) * 140);
          const doneH = Math.round((d.completed / maxVal) * 140);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 9, color: '#9ca3af' }}>
                {d.total > 0 ? d.total : ''}
              </Text>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 140 }}>
                <div
                  title={`Tổng: ${d.total}`}
                  style={{ width: 14, height: totalH, background: '#c4b5fd', borderRadius: '3px 3px 0 0', minHeight: d.total > 0 ? 4 : 0 }}
                />
                <div
                  title={`Hoàn thành: ${d.completed}`}
                  style={{ width: 14, height: doneH, background: '#6c63ff', borderRadius: '3px 3px 0 0', minHeight: d.completed > 0 ? 4 : 0 }}
                />
              </div>
              <Text style={{ fontSize: 10, color: '#9ca3af' }}>{d.date}</Text>
            </div>
          );
        })}
      </div>

      {}
      <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 4 }}>
        {([['#c4b5fd', 'Tổng'], ['#6c63ff', 'Hoàn thành']] as [string, string][]).map(([color, label]) => (
          <Space key={label} size={4}>
            <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
            <Text style={{ fontSize: 11, color: '#9ca3af' }}>{label}</Text>
          </Space>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;