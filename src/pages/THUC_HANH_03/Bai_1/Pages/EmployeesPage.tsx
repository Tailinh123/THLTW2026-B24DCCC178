import React from 'react';
import { Row, Col, Card, Avatar, Typography, Tag, Statistic, Space, Progress } from 'antd';
import { StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Appointment, Employee, Review } from '../types';
import { MOCK_EMPLOYEES } from '../types';

const { Title, Text } = Typography;

interface Props {
  appointments: Appointment[];
  reviews: Review[];
  onEmployeeClick: (emp: Employee) => void;
}

const EmployeesPage: React.FC<Props> = ({ appointments, reviews, onEmployeeClick }) => {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Row gutter={[16, 16]}>
      {MOCK_EMPLOYEES.map(emp => {
        const empAppts = appointments.filter(a => a.employeeId === emp.id);
        const empRevs = reviews.filter(r => r.employeeId === emp.id);
        const avg = empRevs.length > 0
          ? (empRevs.reduce((s, r) => s + r.rating, 0) / empRevs.length).toFixed(1)
          : null;
        const todayCnt = empAppts.filter(a => a.date === today).length;

        return (
          <Col xs={24} sm={12} lg={6} key={emp.id}>
            <Card
              hoverable
              style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}
              onClick={() => onEmployeeClick(emp)}
            >
              <Avatar src={emp.avatar} size={68} style={{ marginBottom: 10 }} />
              <Title level={5} style={{ margin: '0 0 6px' }}>{emp.name}</Title>
              <Tag color="purple" style={{ marginBottom: 12 }}>{emp.specialization}</Tag>

              <Row gutter={8}>
                <Col span={8}>
                  <Statistic title="Tổng" value={empAppts.length} valueStyle={{ fontSize: 18 }} />
                </Col>
                <Col span={8}>
                  <div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Hôm nay</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#6c63ff' }}>{todayCnt}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Rating</div>
                    <Space size={2}>
                      <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{avg ?? '—'}</span>
                    </Space>
                  </div>
                </Col>
              </Row>

              <Progress
                percent={Math.min(100, Math.round((todayCnt / emp.maxClientsPerDay) * 100))}
                size="small" strokeColor="#6c63ff" trailColor="#ede9fe"
                style={{ marginTop: 10 }}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Tối đa {emp.maxClientsPerDay} khách/ngày
              </Text>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default EmployeesPage;