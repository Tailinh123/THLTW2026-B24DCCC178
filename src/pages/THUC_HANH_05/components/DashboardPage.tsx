import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { TeamOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CauLacBo, DonDangKy } from '../types';

interface Props { clubs: CauLacBo[]; memberships: DonDangKy[]; }

const { Title } = Typography;

const DashboardPage: React.FC<Props> = ({ clubs, memberships }) => {
  const pending = useMemo(() => memberships.filter(m => m.trangThai === 'Pending').length, [memberships]);
  const approved = useMemo(() => memberships.filter(m => m.trangThai === 'Approved').length, [memberships]);
  const rejected = useMemo(() => memberships.filter(m => m.trangThai === 'Rejected').length, [memberships]);

  const chartData = useMemo(() => clubs.map(c => ({
    name: c.tenCLB.replace('CLB ', ''),
    'Chờ duyệt': memberships.filter(m => m.clubId === c.id && m.trangThai === 'Pending').length,
    'Đã duyệt': memberships.filter(m => m.clubId === c.id && m.trangThai === 'Approved').length,
    'Từ chối': memberships.filter(m => m.clubId === c.id && m.trangThai === 'Rejected').length,
  })), [clubs, memberships]);

  const statCards = [
    { title: 'Tổng số CLB', value: clubs.length, icon: <TeamOutlined style={{ fontSize: 24, color: '#4f46e5' }} />, bg: '#eef2ff', iconBg: '#e0e7ff' },
    { title: 'Chờ duyệt', value: pending, icon: <FileTextOutlined style={{ fontSize: 24, color: '#f59e0b' }} />, bg: '#fffbeb', iconBg: '#fef3c7' },
    { title: 'Đã duyệt', value: approved, icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#059669' }} />, bg: '#ecfdf5', iconBg: '#d1fae5' },
    { title: 'Từ chối', value: rejected, icon: <CloseCircleOutlined style={{ fontSize: 24, color: '#ef4444' }} />, bg: '#fef2f2', iconBg: '#fee2e2' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {statCards.map(s => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card className="clb-stat-card" bodyStyle={{ padding: '20px 24px' }} style={{ background: s.bg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Statistic
                  title={<span style={{ fontWeight: 600, fontSize: 13, color: '#64748b' }}>{s.title}</span>}
                  value={s.value}
                  valueStyle={{ fontSize: 30, fontWeight: 700, color: '#0f172a' }}
                />
                <div className="clb-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="clb-chart-card" bodyStyle={{ padding: '24px' }}>
        <Title level={5} className="clb-chart-title">Số đơn đăng ký theo từng Câu lạc bộ</Title>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8' }} dy={8} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8' }} dx={-8} />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)', padding: '12px 16px' }}
              itemStyle={{ fontSize: 13, fontWeight: 500 }}
              labelStyle={{ color: '#64748b', marginBottom: 8, fontSize: 13, fontWeight: 600 }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
            <Bar dataKey="Đã duyệt" fill="#10b981" barSize={12} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Chờ duyệt" fill="#fbbf24" barSize={12} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Từ chối" fill="#f43f5e" barSize={12} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardPage;
