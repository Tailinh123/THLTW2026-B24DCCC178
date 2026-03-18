/* ============================================================
 * DashboardPage — Trang tổng quan KPI + Biểu đồ + Nhân viên
 * ============================================================ */
import React, { useMemo } from 'react';
import { Row, Col, Card, Typography, Space, Avatar, Progress } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Appointment, Employee } from '../types';
import { MOCK_SERVICES, formatCurrency } from '../types';
import SimpleBarChart from '../components/SimpleBarChart';

const { Text } = Typography;

interface Props {
  appointments: Appointment[];
  employees: Employee[];
  onEmployeeClick: (emp: Employee) => void;
}

const KPI_ICONS = [
  <CalendarOutlined style={{ fontSize: 20, color: '#6366f1' }} />,
  <ClockCircleOutlined style={{ fontSize: 20, color: '#f59e0b' }} />,
  <CheckCircleOutlined style={{ fontSize: 20, color: '#10b981' }} />,
  <DollarOutlined style={{ fontSize: 20, color: '#3b82f6' }} />,
];

const DashboardPage: React.FC<Props> = ({ appointments, employees, onEmployeeClick }) => {
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
    { label: 'Lịch hẹn hôm nay', value: appointments.filter(a => a.date === today).length, color: '#6366f1' },
    { label: 'Chờ xác nhận', value: appointments.filter(a => a.status === 'pending').length, color: '#f59e0b' },
    { label: 'Hoàn thành tháng', value: appointments.filter(a => a.status === 'completed' && a.date.startsWith(thisMonth)).length, color: '#10b981' },
    { label: 'Doanh thu tháng', value: formatCurrency(monthRevenue), color: '#3b82f6', isText: true },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {kpiCards.map((item, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card className="bb-kpi-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${item.color}10`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {KPI_ICONS[i]}
                </div>
                <div>
                  <Text className="bb-kpi-label">{item.label}</Text>
                  {item.isText
                    ? <div className="bb-kpi-value" style={{ color: item.color, fontSize: 20 }}>{item.value}</div>
                    : <div className="bb-kpi-value" style={{ color: item.color }}>{item.value}</div>
                  }
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Biểu đồ */}
        <Col xs={24} lg={15}>
          <Card className="bb-card" title="Lịch hẹn 7 ngày gần nhất">
            <SimpleBarChart data={chartData} />
          </Card>
        </Col>

        {/* Nhân viên */}
        <Col xs={24} lg={9}>
          <Card className="bb-card" title="Nhân viên" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              {employees.map(emp => {
                const cnt = appointments.filter(a => a.employeeId === emp.id && a.status === 'completed').length;
                const rev = appointments
                  .filter(a => a.employeeId === emp.id && a.status === 'completed')
                  .reduce((s, a) => s + (MOCK_SERVICES.find(sv => sv.id === a.serviceId)?.price ?? 0), 0);
                return (
                  <div key={emp.id} className="bb-emp-row" onClick={() => onEmployeeClick(emp)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Space>
                        <Avatar src={emp.avatar} size={32} />
                        <div>
                          <Text style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', display: 'block' }}>{emp.name}</Text>
                          <Text style={{ fontSize: 12, color: '#64748b' }}>{cnt} lịch hoàn thành</Text>
                        </div>
                      </Space>
                      <Text style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>
                        {(rev / 1000).toFixed(0)}k
                      </Text>
                    </div>
                    <Progress
                      className="bb-progress"
                      percent={Math.min(100, cnt * 10)}
                      showInfo={false}
                      strokeColor="#6366f1"
                      trailColor="#eef2ff"
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