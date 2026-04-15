import React from 'react';
import { Space, Row, Col, Card, Statistic, Progress, Tag, Timeline, Empty, Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, FireOutlined, BarChartOutlined, AimOutlined, CheckCircleOutlined, BookOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useStudy } from '../../hooks/useStudy';
import dayjs from 'dayjs';

const { Text } = Typography;

const fmtMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}p`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}p`;
};

export default function DashboardModule() {
  const study = useStudy();
  const thisMonth = dayjs().format("YYYY-MM");
  const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM");

  const thisLogs = study.getMonthLogs(thisMonth);
  const thisMins = study.getMonthMinutes(thisMonth);
  const thisHours = +(thisMins / 60).toFixed(1);
  const thisGoal = study.getGoal(thisMonth);
  const thisPct = thisGoal ? Math.min(100, Math.round((thisHours / thisGoal.targetHours) * 100)) : null;

  const lastMins = study.getMonthMinutes(lastMonth);
  const lastHours = +(lastMins / 60).toFixed(1);

  const totalLogs = study.logs.length;
  const totalMins = study.logs.reduce((s, l) => s + l.duration, 0);
  const totalHours = +(totalMins / 60).toFixed(1);

  
  const recentLogs = [...study.logs]
    .sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix())
    .slice(0, 5);

  const getCat = (id: string) => study.categories.find(c => c.id === id);

  
  const catBreakdown = study.categories.map(cat => {
    const mins = thisLogs.filter(l => l.categoryId === cat.id).reduce((s, l) => s + l.duration, 0);
    return { ...cat, hours: +(mins / 60).toFixed(1), sessions: thisLogs.filter(l => l.categoryId === cat.id).length };
  }).filter(c => c.sessions > 0).sort((a, b) => b.hours - a.hours);

  const progressColor = thisPct == null ? '#1890ff'
    : thisPct >= 100 ? "#52c41a" : thisPct >= 70 ? "#1890ff" : thisPct >= 40 ? "#fa8c16" : "#f5222d";

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card><Statistic title="Tổng buổi học" value={totalLogs} prefix={<CalendarOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card><Statistic title="Tổng giờ học" value={totalHours} suffix="h" prefix={<ClockCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card><Statistic title="Tháng này" value={thisHours} suffix="h" prefix={<FireOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card><Statistic title="Tháng trước" value={lastHours} suffix="h" prefix={<BarChartOutlined />} valueStyle={{ color: 'rgba(0,0,0,0.45)' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Card title={<Space><AimOutlined /><span>Mục tiêu tháng {dayjs().format("MM/YYYY")}</span></Space>} style={{ height: "100%" }}>
            {thisGoal ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <Progress
                  type="circle" percent={thisPct!} strokeColor={progressColor} width={180}
                  format={p => (
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: progressColor }}>{p}%</div>
                      <div style={{ fontSize: 12, color: "#999" }}>{thisHours}h / {thisGoal.targetHours}h</div>
                    </div>
                  )}
                />
                <div style={{ marginTop: 16 }}>
                  {thisPct! >= 100
                    ? <Tag color="success" icon={<CheckCircleOutlined />}>Đã hoàn thành mục tiêu! 🎊</Tag>
                    : <Tag color="processing">Còn {Math.max(0, +(thisGoal.targetHours - thisHours).toFixed(1))}h nữa</Tag>}
                </div>
              </div>
            ) : (
              <Empty description="Chưa đặt mục tiêu tháng này" style={{ padding: "32px 0" }} />
            )}
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card title={<Space><BookOutlined /><span>Phân bổ theo môn — tháng này</span></Space>} style={{ height: "100%" }}>
            {catBreakdown.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {catBreakdown.map(cat => (
                  <div key={cat.id} style={{ width: '100%' }}>
                    <Row justify="space-between">
                      <Text><span style={{ marginRight: 6 }}>{cat.icon}</span>{cat.name}</Text>
                      <Space>
                        <Text strong>{cat.hours}h</Text>
                        <Text type="secondary">({cat.sessions} buổi)</Text>
                      </Space>
                    </Row>
                    <Progress
                      percent={totalMins > 0 ? Math.round((cat.hours / thisHours) * 100) : 0}
                      strokeColor={cat.color}
                      showInfo={false}
                    />
                  </div>
                ))}
              </Space>
            ) : (
              <Empty description="Chưa có dữ liệu trong tháng này" style={{ padding: "32px 0" }} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title={<Space><OrderedListOutlined /><span>Buổi học gần đây</span></Space>}>
        {recentLogs.length > 0 ? (
          <Timeline>
            {recentLogs.map((log: any) => {
              const cat = getCat(log.categoryId);
              return (
                <Timeline.Item key={log.id} color={cat?.color ?? "#1890ff"}>
                  <Space direction="vertical" size={2}>
                    <Space>
                      {cat && <Tag color={cat.color}>{cat.icon} {cat.name}</Tag>}
                      <Tag icon={<ClockCircleOutlined />}>{fmtMinutes(log.duration)}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(log.startTime).format("DD/MM HH:mm")}</Text>
                    </Space>
                    <Text>{log.content}</Text>
                  </Space>
                </Timeline.Item>
              );
            })}
          </Timeline>
        ) : (
          <Empty description="Chưa có buổi học nào" />
        )}
      </Card>
    </Space>
  );
}
