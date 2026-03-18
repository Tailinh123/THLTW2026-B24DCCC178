
import React from 'react';
import {
  Drawer, Tabs, Avatar, Typography, Space,
  Tag, Row, Col, Descriptions, Progress,
} from 'antd';
import type { Employee, Appointment, Review, DayOfWeek } from '../types';
import { MOCK_SERVICES, DAY_NAMES, formatCurrency } from '../types';
import ReviewList from './ReviewList';

const { Title, Text } = Typography;

interface Props {
  employee: Employee | null;
  appointments: Appointment[];
  reviews: Review[];
  onClose: () => void;
  onReply: (reviewId: string, content: string) => void;
}

const EmployeeDrawer: React.FC<Props> = ({
  employee, appointments, reviews, onClose, onReply,
}) => {
  if (!employee) return null;

  const empReviews = reviews.filter(r => r.employeeId === employee.id);
  const empAppts = appointments.filter(a => a.employeeId === employee.id);

  const avgRating = empReviews.length > 0
    ? (empReviews.reduce((s, r) => s + r.rating, 0) / empReviews.length).toFixed(1)
    : '—';

  const revenue = empAppts
    .filter(a => a.status === 'completed')
    .reduce((s, a) => s + (MOCK_SERVICES.find(sv => sv.id === a.serviceId)?.price ?? 0), 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = empAppts.filter(a => a.date === todayStr).length;

  return (
    <Drawer
      title={
        <Space>
          <Avatar src={employee.avatar} size={32} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>{employee.name}</span>
        </Space>
      }
      placement="right"
      width={500}
      visible={!!employee}
      onClose={onClose}
      className="bb-drawer"
    >
      <Tabs
        items={[
          {
            key: 'info',
            label: 'Thông tin',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size={20}>
                {}
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <Avatar src={employee.avatar} size={80} className="bb-emp-avatar" />
                  <Title level={4} style={{ margin: '12px 0 4px', fontWeight: 700 }}>{employee.name}</Title>
                  <Tag color="purple" className="bb-emp-tag">{employee.specialization}</Tag>
                </div>

                {}
                <Row gutter={16}>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <div className="bb-emp-stat-label">Tổng lịch</div>
                    <div className="bb-emp-stat-value" style={{ color: '#0f172a' }}>{empAppts.length}</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <div className="bb-emp-stat-label">Rating TB</div>
                    <div className="bb-emp-stat-value" style={{ color: '#f59e0b' }}>{avgRating}</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <div className="bb-emp-stat-label">Doanh thu</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>
                      {formatCurrency(revenue)}
                    </div>
                  </Col>
                </Row>

                {}
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Điện thoại">{employee.phone}</Descriptions.Item>
                  <Descriptions.Item label="Khách tối đa/ngày">{employee.maxClientsPerDay}</Descriptions.Item>
                  <Descriptions.Item label="Giới thiệu">{employee.bio}</Descriptions.Item>
                </Descriptions>

                {}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: 600 }}>Khách hôm nay</Text>
                    <Text style={{ fontSize: 14, color: '#6366f1', fontWeight: 700 }}>
                      {todayCount} / {employee.maxClientsPerDay}
                    </Text>
                  </div>
                  <Progress
                    className="bb-progress"
                    percent={Math.min(100, Math.round((todayCount / employee.maxClientsPerDay) * 100))}
                    strokeColor="#6366f1" trailColor="#eef2ff" size="small"
                  />
                </div>

                {}
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 15 }}>
                    Lịch làm việc
                  </Text>
                  <Space direction="vertical" style={{ width: '100%' }} size={6}>
                    {employee.schedule.map(s => (
                      <div key={s.day} className="bb-schedule-row">
                        <span className="bb-schedule-day">{DAY_NAMES[s.day as DayOfWeek]}</span>
                        <span className="bb-schedule-time">{s.startTime} – {s.endTime}</span>
                      </div>
                    ))}
                  </Space>
                </div>
              </Space>
            ),
          },
          {
            key: 'reviews',
            label: `Đánh giá (${empReviews.length})`,
            children: <ReviewList reviews={empReviews} onReply={onReply} />,
          },
        ]}
      />
    </Drawer>
  );
};

export default EmployeeDrawer;