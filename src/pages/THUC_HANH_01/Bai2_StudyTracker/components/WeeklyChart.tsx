import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import moment from 'moment';
import styles from '../index.less';

const WeeklyChart: React.FC = () => {
  const { sessions } = useSelector((state: RootState) => state.study);

  const getLast7DaysData = () => {
    const days: { name: string; hours: number; fullDate: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'day');
      const dayHours = sessions
        .filter((s) => moment(s.date).isSame(date, 'day'))
        .reduce((sum, s) => sum + s.durationHours, 0);
      days.push({
        name: date.format('DD/MM'),
        hours: Math.round(dayHours * 10) / 10,
        fullDate: date.format('dddd, DD/MM/YYYY'),
      });
    }
    return days;
  };

  const data = getLast7DaysData();
  const maxHours = Math.max(...data.map((d) => d.hours), 1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#1a1d2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
          }}
        >
          <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 2 }}>{label}</div>
          <div style={{ color: '#818cf8' }}>{payload[0].value}h học</div>
        </div>
      );
    }
    return null;
  };

  const totalWeekHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>Hoạt động 7 ngày qua</span>
        <span className={styles.chartBadge}>
          Tổng: {Math.round(totalWeekHours * 10) / 10}h
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            domain={[0, Math.ceil(maxHours * 1.2)]}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.hours > 0 ? '#6366f1' : 'rgba(99, 102, 241, 0.15)'}
                fillOpacity={entry.hours > 0 ? 0.85 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
