import React from 'react';
import { Row, Col, Card, Statistic, Progress, Space, Typography, Tag } from 'antd';
import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { DashboardStats } from '../../types';

const { Text } = Typography;

interface StatCardsProps {
  stats: DashboardStats;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: <AppstoreOutlined />,
      color: '#6366f1',
      bgColor: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    },
    {
      title: 'Giá trị tồn kho',
      value: formatCurrency(stats.totalInventoryValue),
      suffix: ' đ',
      icon: <DollarOutlined />,
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: <ShoppingCartOutlined />,
      color: '#f59e0b',
      bgColor: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      suffix: ' đ',
      icon: <BankOutlined />,
      color: '#ef4444',
      bgColor: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    },
  ];

  const statusIcons: Record<string, React.ReactNode> = {
    'Chờ xử lý': <ClockCircleOutlined />,
    'Đang giao': <CarOutlined />,
    'Hoàn thành': <CheckCircleOutlined />,
    'Đã hủy': <CloseCircleOutlined />,
  };

  const statusColors: Record<string, string> = {
    'Chờ xử lý': 'gold',
    'Đang giao': 'blue',
    'Hoàn thành': 'green',
    'Đã hủy': 'red',
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {statItems.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card
              className="stat-card"
              bodyStyle={{ padding: '20px' }}
              style={{ borderRadius: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: item.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {item.title}
                  </Text>
                  <div style={{ fontSize: 24, fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>
                    {item.value}{item.suffix || ''}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 16, borderRadius: 12 }} bodyStyle={{ padding: '16px 20px' }}>
        <Text strong style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b' }}>
          Phân bổ đơn hàng theo trạng thái
        </Text>
        <Row gutter={16} style={{ marginTop: 12 }}>
          {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
            <Col key={status} xs={12} sm={6}>
              <Space>
                <Tag color={statusColors[status]} icon={statusIcons[status]}>
                  {status}
                </Tag>
                <Text strong>{count}</Text>
              </Space>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default StatCards;
