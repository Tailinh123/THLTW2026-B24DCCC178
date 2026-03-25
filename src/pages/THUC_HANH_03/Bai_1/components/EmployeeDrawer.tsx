import React from 'react';
import {
  Drawer, Tabs, Avatar, Typography, Space,
  Tag, Row, Col, Statistic, Descriptions, Progress,
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
          <Avatar src={employee.avatar} size={30} />
          <span>{employee.name}</span>
        </Space>
      }
      placement="right"
      width={480}
      open={!!employee}
      onClose={onClose}
    >
      <Tabs
        items={[
          {
            key: 'info',
            label: 'Thông tin',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {}
                <div style={{ textAlign: 'center' }}>
                  <Avatar src={employee.avatar} size={76} />
                  <Title level={4} style={{ margin: '10px 0 4px' }}>{employee.name}</Title>
                  <Tag color="purple">{employee.specialization}</Tag>
                </div>

                {}
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic title="Tổng lịch" value={empAppts.length} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Rating TB" value={avgRating} />
                  </Col>
                  <Col span={8}>
                    <div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Doanh thu</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#6c63ff' }}>
                        {formatCurrency(revenue)}
                      </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13 }}>Khách hôm nay</Text>
                    <Text style={{ fontSize: 13, color: '#6c63ff', fontWeight: 600 }}>
                      {todayCount} / {employee.maxClientsPerDay}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.min(100, Math.round((todayCount / employee.maxClientsPerDay) * 100))}
                    strokeColor="#6c63ff" trailColor="#ede9fe" size="small"
                  />
                </div>

                {}
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    📅 Lịch làm việc
                  </Text>
                  <Space direction="vertical" style={{ width: '100%' }} size={4}>
                    {employee.schedule.map(s => (
                      <div
                        key={s.day}
                        style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '5px 10px', background: '#f9f5ff', borderRadius: 7,
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{DAY_NAMES[s.day as DayOfWeek]}</Text>
                        <Text style={{ fontSize: 13, color: '#6c63ff', fontWeight: 500 }}>
                          {s.startTime} – {s.endTime}
                        </Text>
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