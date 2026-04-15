/* ============================================================
 * GameStatsPanel — Thống kê tổng hợp + Biểu đồ phân bổ
 * ============================================================ */
import React from 'react';
import { Card, Row, Col, Statistic, Tag, Typography } from 'antd';
import { TrophyOutlined, FireOutlined, BarChartOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip, Legend } from 'recharts';
import { useAppSelector } from '../../store';
import { calcStats } from '../types';

const { Text } = Typography;
const PIE_COLORS = ['#fa8c16', '#1890ff', '#52c41a'];

export const GameStatsPanel: React.FC = () => {
  const history = useAppSelector((s) => s.game.history);
  const stats = calcStats(history);

  const pieData = [
    { name: 'Búa', value: stats.choiceDistribution.rock },
    { name: 'Bao', value: stats.choiceDistribution.paper },
    { name: 'Kéo', value: stats.choiceDistribution.scissors },
  ].filter((d) => d.value > 0);

  return (
    <Card
      className="game-card"
      title={
        <span style={{ color: '#faad14' }}>
          <BarChartOutlined /> Thống kê
        </span>
      }
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic title="Tổng trận" value={stats.totalGames} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Tỷ lệ thắng"
              value={stats.winRate}
              suffix="%"
              valueStyle={{ color: stats.winRate >= 50 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Chuỗi thắng hiện tại"
              value={stats.currentStreak}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Chuỗi thắng tốt nhất"
              value={stats.bestStreak}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col span={8}>
          <Tag color="green" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
            Thắng: {stats.wins}
          </Tag>
        </Col>
        <Col span={8}>
          <Tag color="red" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
            Thua: {stats.losses}
          </Tag>
        </Col>
        <Col span={8}>
          <Tag color="gold" style={{ width: '100%', textAlign: 'center', padding: '4px 0' }}>
            Hòa: {stats.draws}
          </Tag>
        </Col>
      </Row>

      {pieData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Phân bổ lựa chọn</Text>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={60} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
