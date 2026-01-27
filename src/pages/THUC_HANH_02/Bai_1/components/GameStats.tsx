
import React from 'react';
import { Card, Row, Col, Statistic, Tag, Typography, Progress } from 'antd';
import { TrophyOutlined, FireOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store';
import { calcStats, CHOICE_EMOJI } from '../types';

const { Text } = Typography;


const DistributionBar: React.FC<{
  label: string;
  emoji: string;
  value: number;
  total: number;
  color: string;
}> = ({ label, emoji, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="stat-bar-wrap">
      <div className="stat-bar-label">
        <span>
          {emoji} {label}
        </span>
        <span style={{ color }}>{value} ({pct}%)</span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

export const GameStatsPanel: React.FC = () => {
  const history = useAppSelector((s) => s.game.history);
  const stats = calcStats(history);

  const dist = stats.choiceDistribution;
  const totalPicks = dist.rock + dist.paper + dist.scissors;

  return (
    <Card
      className="game-card"
      title={
        <span style={{ color: '#818cf8' }}>
          <BarChartOutlined className="card-title-icon" />
          Thống kê
        </span>
      }
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Tổng trận"
              value={stats.totalGames}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Tỷ lệ thắng"
              value={stats.winRate}
              suffix="%"
              valueStyle={{
                color: stats.winRate >= 50 ? '#34d399' : '#f87171',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Chuỗi hiện tại"
              value={stats.currentStreak}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#818cf8' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" className="stat-mini-card">
            <Statistic
              title="Chuỗi tốt nhất"
              value={stats.bestStreak}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#a78bfa' }}
            />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={[8, 8]} style={{ marginTop: 14 }}>
        <Col span={8}>
          <Tag
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '5px 0',
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
              color: '#34d399',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Thắng: {stats.wins}
          </Tag>
        </Col>
        <Col span={8}>
          <Tag
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '5px 0',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              color: '#f87171',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Thua: {stats.losses}
          </Tag>
        </Col>
        <Col span={8}>
          <Tag
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '5px 0',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              color: '#fbbf24',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Hòa: {stats.draws}
          </Tag>
        </Col>
      </Row>

      {}
      {totalPicks > 0 && (
        <div style={{ marginTop: 18 }}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'block',
              marginBottom: 10,
            }}
          >
            Phân bổ lựa chọn
          </Text>
          <DistributionBar
            label="Búa"
            emoji={CHOICE_EMOJI.rock}
            value={dist.rock}
            total={totalPicks}
            color="#818cf8"
          />
          <DistributionBar
            label="Bao"
            emoji={CHOICE_EMOJI.paper}
            value={dist.paper}
            total={totalPicks}
            color="#34d399"
          />
          <DistributionBar
            label="Kéo"
            emoji={CHOICE_EMOJI.scissors}
            value={dist.scissors}
            total={totalPicks}
            color="#f87171"
          />
        </div>
      )}
    </Card>
  );
};
