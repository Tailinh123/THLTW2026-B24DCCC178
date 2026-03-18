import React from 'react';
import { Row, Col, Card, Typography, Tag } from 'antd';
import type { Appointment } from '../types';
import { MOCK_SERVICES, formatCurrency } from '../types';

const { Title, Text } = Typography;

const COLOR_HEX: Record<string, string> = {
  blue: '#1677ff', purple: '#722ed1',
  green: '#52c41a', red: '#ff4d4f', pink: '#eb2f96',
};

interface Props {
  appointments: Appointment[];
}

const ServicesPage: React.FC<Props> = ({ appointments }) => {
  return (
    <Row gutter={[16, 16]}>
      {MOCK_SERVICES.map(svc => {
        const booked = appointments.filter(a => a.serviceId === svc.id && a.status !== 'cancelled').length;
        const revenue = appointments
          .filter(a => a.serviceId === svc.id && a.status === 'completed')
          .length * svc.price;

        return (
          <Col xs={24} sm={12} lg={8} key={svc.id}>
            <Card
              style={{
                borderRadius: 12, border: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                borderTop: `4px solid ${COLOR_HEX[svc.color] ?? '#6c63ff'}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <Tag color={svc.color} style={{ marginBottom: 6 }}>{svc.category}</Tag>
                  <Title level={5} style={{ margin: 0 }}>{svc.name}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>{svc.description}</Text>
                </div>
                <Tag color={svc.isActive ? 'green' : 'red'}>
                  {svc.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
              </div>

              {/* Stats */}
              <Row gutter={8}>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Giá</Text>
                  <div style={{ fontWeight: 700, color: '#6c63ff' }}>
                    {(svc.price / 1000).toFixed(0)}k
                  </div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Thời gian</Text>
                  <div style={{ fontWeight: 600 }}>{svc.durationMinutes} phút</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Lượt đặt</Text>
                  <div style={{ fontWeight: 600, color: '#10b981' }}>{booked}</div>
                </Col>
              </Row>

              {/* Revenue */}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>Doanh thu: </Text>
                <Text style={{ fontWeight: 600, color: '#6c63ff' }}>{formatCurrency(revenue)}</Text>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ServicesPage;