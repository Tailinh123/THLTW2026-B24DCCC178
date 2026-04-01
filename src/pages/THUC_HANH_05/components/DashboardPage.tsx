import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { TeamOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CauLacBo, DonDangKy } from '../types';

interface Props {
  clubs: CauLacBo[];
  memberships: DonDangKy[];
}

const { Title } = Typography;

const DashboardPage: React.FC<Props> = ({ clubs, memberships }) => {
  const pending = useMemo(() => memberships.filter((m) => m.trangThai === 'Pending').length, [memberships]);
  const approved = useMemo(() => memberships.filter((m) => m.trangThai === 'Approved').length, [memberships]);
  const rejected = useMemo(() => memberships.filter((m) => m.trangThai === 'Rejected').length, [memberships]);

  const chartData = useMemo(
    () =>
      clubs.map((c) => ({
        name: c.tenCLB.replace('CLB ', ''),
        'Chờ duyệt': memberships.filter((m) => m.clubId === c.id && m.trangThai === 'Pending').length,
        'Đã duyệt': memberships.filter((m) => m.clubId === c.id && m.trangThai === 'Approved').length,
        'Từ chối': memberships.filter((m) => m.clubId === c.id && m.trangThai === 'Rejected').length,
      })),
    [clubs, memberships],
  );

  const statCards = [
    {
      title: 'Tổng số CLB',
      value: clubs.length,
      icon: <TeamOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      color: '#e6f4ff',
      border: '#91caff',
    },
    {
      title: 'Chờ duyệt',
      value: pending,
      icon: <FileTextOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      color: '#fff7e6',
      border: '#ffd591',
    },
    {
      title: 'Đã duyệt',
      value: approved,
      icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      color: '#f6ffed',
      border: '#b7eb8f',
    },
    {
      title: 'Từ chối',
      value: rejected,
      icon: <CloseCircleOutlined style={{ fontSize: 28, color: '#ff4d4f' }} />,
      color: '#fff1f0',
      border: '#ffa39e',
    },
  ];

  return (
    <div>
      <Row gutter={[20, 20]}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card
              style={{
                borderRadius: 12,
                border: `1px solid ${s.border}`,
                background: s.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Statistic
                  title={<span style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</span>}
                  value={s.value}
                  valueStyle={{ fontSize: 32, fontWeight: 700 }}
                />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  {s.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{ marginTop: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title level={5} style={{ marginBottom: 24 }}>
          Số đơn đăng ký theo từng Câu lạc bộ
        </Title>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Chờ duyệt" fill="#fa8c16" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Đã duyệt" fill="#52c41a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Từ chối" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardPage;
