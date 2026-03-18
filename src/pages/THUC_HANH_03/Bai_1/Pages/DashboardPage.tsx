import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Space, Avatar, Typography, Progress } from 'antd';
import dayjs from 'dayjs';
import type { Appointment, Employee } from '../types';
import { MOCK_EMPLOYEES, MOCK_SERVICES, formatCurrency } from '../types';
import SimpleBarChart from '../components/SimpleBarChart';

const { Text } = Typography;

interface Props {
  appointments: Appointment[];
  onEmployeeClick: (emp: Employee) => void;
}

const DashboardPage: React.FC<Props> = ({ appointments, onEmployeeClick }) => {
  const today = dayjs().format('YYYY-MM-DD');
  const thisMonth = dayjs().format('YYYY-MM');

  const chartData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = dayjs().subtract(6 - i, 'day');
      const ds = d.format('YYYY-MM-DD');
      const dayAppts = appointments.filter(a => a.date === ds);
      return {
        date: d.format('DD/MM'),
        total: dayAppts.length,
        completed: dayAppts.filter(a => a.status === 'completed').length,
      };
    }), [appointments]);

  const monthRevenue = useMemo(() =>
    appointments
      .filter(a => a.status === 'completed' && a.date.startsWith(thisMonth))
      .reduce((s, a) => s + (MOCK_SERVICES.find(sv => sv.id === a.serviceId)?.price ?? 0), 0),
    [appointments, thisMonth]);

  const kpiCards = [
    { label: 'Lịch hẹn hôm nay', value: appointments.filter(a => a.date === today).length, color: '#6c63ff' },
    { label: 'Chờ xác nhận', value: appointments.filter(a => a.status === 'pending').length, color: '#f59e0b' },
    { label: 'Hoàn thành tháng', value: appointments.filter(a => a.status === 'completed' && a.date.startsWith(thisMonth)).length, color: '#10b981' },
    { label: 'Doanh thu tháng', value: formatCurrency(monthRevenue), color: '#3b82f6', isText: true },
  ];

  return (
    <div>
      {/* KPI */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {kpiCards.map((item, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
              {item.isText
                ? <div style={{ fontSize: 18, fontWeight: 700, color: item.color, marginTop: 8 }}>{item.value}</div>
                : <Statistic value={item.value as number} valueStyle={{ color: item.color, fontWeight: 700 }} />
              }
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Biểu đồ */}
        <Col xs={24} lg={15}>
          <Card
            title="Lịch hẹn 7 ngày gần nhất"
            style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
          >
            <SimpleBarChart data={chartData} />
          </Card>
        </Col>

        {/* Top nhân viên */}
        <Col xs={24} lg={9}>
          <Card
            title="Nhân viên"
            style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {MOCK_EMPLOYEES.map(emp => {
                const cnt = appointments.filter(a => a.employeeId === emp.id && a.status === 'completed').length;
                const rev = appointments
                  .filter(a => a.employeeId === emp.id && a.status === 'completed')
                  .reduce((s, a) => s + (MOCK_SERVICES.find(sv => sv.id === a.serviceId)?.price ?? 0), 0);
                return (
                  <div key={emp.id} style={{ cursor: 'pointer' }} onClick={() => onEmployeeClick(emp)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Space>
                        <Avatar src={emp.avatar} size={26} />
                        <div>
                          <Text style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 11 }}>{cnt} lịch hoàn thành</Text>
                        </div>
                      </Space>
                      <Text style={{ fontSize: 12, color: '#6c63ff', fontWeight: 600 }}>
                        {(rev / 1000).toFixed(0)}k
                      </Text>
                    </div>
                    <Progress
                      percent={Math.min(100, cnt * 10)}
                      showInfo={false}
                      strokeColor="#6c63ff"
                      trailColor="#ede9fe"
                      size="small"
                    />
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;