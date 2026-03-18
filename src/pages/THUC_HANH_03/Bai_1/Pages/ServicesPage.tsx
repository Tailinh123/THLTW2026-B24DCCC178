
import React from 'react';
import { Row, Col, Card, Typography, Tag } from 'antd';
import type { Appointment } from '../types';
import { MOCK_SERVICES, formatCurrency } from '../types';

const { Text } = Typography;

const COLOR_HEX: Record<string, string> = {
  blue: '#3b82f6', purple: '#6366f1',
  green: '#10b981', red: '#ef4444', pink: '#ec4899',
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
        const accent = COLOR_HEX[svc.color] ?? '#6366f1';

        return (
          <Col xs={24} sm={12} lg={8} key={svc.id}>
            <Card className="bb-svc-card">
              <div className="bb-svc-accent" style={{ background: accent }} />

              {}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <Tag color={svc.color} className="bb-tag" style={{ marginBottom: 8 }}>{svc.category}</Tag>
                  <div className="bb-svc-name">{svc.name}</div>
                  <div className="bb-svc-desc">{svc.description}</div>
                </div>
                <Tag color={svc.isActive ? 'green' : 'red'} className="bb-tag">
                  {svc.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
              </div>

              {}
              <div className="bb-svc-stats">
                <div>
                  <div className="bb-svc-stat-label">Giá</div>
                  <div className="bb-svc-stat-value" style={{ color: accent }}>
                    {(svc.price / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div className="bb-svc-stat-label">Thời gian</div>
                  <div className="bb-svc-stat-value" style={{ color: '#0f172a' }}>{svc.durationMinutes} phút</div>
                </div>
                <div>
                  <div className="bb-svc-stat-label">Lượt đặt</div>
                  <div className="bb-svc-stat-value" style={{ color: '#10b981' }}>{booked}</div>
                </div>
              </div>

              {}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>Doanh thu: </Text>
                <Text style={{ fontWeight: 700, color: accent }}>{formatCurrency(revenue)}</Text>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ServicesPage;