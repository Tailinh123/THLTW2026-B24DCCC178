
import React from 'react';
import { Row, Col, Card, Avatar, Typography, Tag, Space, Progress, Button, Popconfirm } from 'antd';
import { StarFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Appointment, Employee, Review } from '../types';

const { Text } = Typography;

interface Props {
  appointments: Appointment[];
  reviews: Review[];
  employees: Employee[];
  onEmployeeClick: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeesPage: React.FC<Props> = ({ appointments, reviews, employees, onEmployeeClick, onEdit, onDelete }) => {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Row gutter={[20, 20]}>
      {employees.map(emp => {
        const empAppts = appointments.filter(a => a.employeeId === emp.id);
        const empRevs = reviews.filter(r => r.employeeId === emp.id);
        const avg = empRevs.length > 0
          ? (empRevs.reduce((s, r) => s + r.rating, 0) / empRevs.length).toFixed(1)
          : null;
        const todayCnt = empAppts.filter(a => a.date === today).length;

        return (
          <Col xs={24} sm={12} lg={6} key={emp.id}>
            <Card className="bb-emp-card" onClick={() => onEmployeeClick(emp)}>
              <Avatar
                src={emp.avatar} size={76} className="bb-emp-avatar"
                style={{ objectFit: 'cover' }}
              />
              <div className="bb-emp-name">{emp.name}</div>
              <Tag color="purple" className="bb-emp-tag">{emp.specialization}</Tag>

              <Row gutter={8} style={{ textAlign: 'center', marginBottom: 12 }}>
                <Col span={8}>
                  <div className="bb-emp-stat-label">Tổng</div>
                  <div className="bb-emp-stat-value" style={{ color: '#0f172a' }}>{empAppts.length}</div>
                </Col>
                <Col span={8}>
                  <div className="bb-emp-stat-label">Hôm nay</div>
                  <div className="bb-emp-stat-value" style={{ color: '#6366f1' }}>{todayCnt}</div>
                </Col>
                <Col span={8}>
                  <div className="bb-emp-stat-label">Rating</div>
                  <Space size={2}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 14 }} />
                    <span className="bb-emp-stat-value" style={{ color: '#0f172a', fontSize: 18 }}>{avg ?? '—'}</span>
                  </Space>
                </Col>
              </Row>

              <Progress
                className="bb-progress"
                percent={Math.min(100, Math.round((todayCnt / emp.maxClientsPerDay) * 100))}
                size="small" strokeColor="#6366f1" trailColor="#eef2ff"
              />
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'block' }}>
                Tối đa {emp.maxClientsPerDay} khách/ngày
              </Text>

              {}
              <div className="bb-emp-actions">
                <Button
                  size="small" type="text"
                  icon={<EditOutlined />}
                  style={{ color: '#6366f1', fontWeight: 600, borderRadius: 8 }}
                  onClick={(e) => { e.stopPropagation(); onEdit(emp); }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa nhân viên này?"
                  okText="Xóa" cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={(e) => { e?.stopPropagation(); onDelete(emp.id); }}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button
                    size="small" type="text" danger
                    icon={<DeleteOutlined />}
                    style={{ fontWeight: 600, borderRadius: 8 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default EmployeesPage;