import React from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  bgGradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, suffix, color, bgGradient }) => {
  return (
    <Card
      bordered={false}
      className="th08-stat-card"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
      }}
      bodyStyle={{ padding: '20px 24px', position: 'relative', zIndex: 1 }}
    >
      {}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: bgGradient,
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Text style={{ color: '#8c8c8c', fontSize: 13, display: 'block', marginBottom: 8 }}>
            {label}
          </Text>
          <Title level={3} style={{ margin: 0, color, fontWeight: 700 }}>
            {value}
            {suffix && (
              <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, color: '#8c8c8c' }}>
                {suffix}
              </span>
            )}
          </Title>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
