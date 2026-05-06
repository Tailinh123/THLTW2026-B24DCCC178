import React from 'react';
import { Row, Col, Card, Progress, Tag, Typography, Avatar, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ProjectOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { Task } from '../types';
import { PRIORITY_CONFIG, STATUS_CONFIG, isOverdue } from '../types';

const { Text } = Typography;

interface DashboardTabProps {
  tasks: Task[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ tasks }) => {
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;
  const overdueCount = tasks.filter((t) => isOverdue(t.deadline, t.status)).length;
  const total = tasks.length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Tổng công việc',
      value: total,
      icon: <ProjectOutlined />,
      color: '#6366f1',
      bg: '#eef2ff',
    },
    {
      title: 'Đang thực hiện',
      value: inProgressCount,
      icon: <ClockCircleOutlined />,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      title: 'Đã hoàn thành',
      value: doneCount,
      icon: <CheckCircleOutlined />,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: 'Quá hạn',
      value: overdueCount,
      icon: <FireOutlined />,
      color: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  return (
    <div className="kanban-dashboard-modern">
      {/* Top Stats Row */}
      <Row gutter={[24, 24]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card className="modern-stat-card" bordered={false}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                    {card.title}
                  </Text>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                    {card.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Left Column - Recent Tasks */}
        <Col xs={24} lg={16}>
          <Card 
            className="modern-panel-card" 
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Công việc gần đây</span>} 
            bordered={false}
            extra={<a href="#kanban" style={{ color: '#6366f1', fontSize: 13, fontWeight: 500 }}>Xem tất cả <ArrowRightOutlined /></a>}
            style={{ height: '100%' }}
          >
            <div className="recent-tasks-list">
              {recentTasks.map((task) => {
                const overdue = isOverdue(task.deadline, task.status);
                return (
                  <div key={task.id} className="recent-task-item">
                    <div className="recent-task-left">
                      <Tooltip title={STATUS_CONFIG[task.status].label}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: STATUS_CONFIG[task.status].color,
                            boxShadow: `0 0 0 3px ${STATUS_CONFIG[task.status].color}20`,
                          }}
                        />
                      </Tooltip>
                      <div>
                        <Text strong style={{ fontSize: 14, color: '#1e293b', display: 'block', marginBottom: 4 }}>
                          {task.title}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>KAN-{task.id.slice(-4).toUpperCase()}</Text>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: overdue ? '#ef4444' : '#94a3b8' }}>
                            <CalendarOutlined style={{ fontSize: 12 }} />
                            <span style={{ fontSize: 12 }}>{moment(task.deadline).format('DD/MM/YYYY')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="recent-task-right">
                      <Tag color={PRIORITY_CONFIG[task.priority].color} style={{ borderRadius: 4, border: 'none', fontWeight: 600, background: `${PRIORITY_CONFIG[task.priority].color}15`, color: PRIORITY_CONFIG[task.priority].color }}>
                        {PRIORITY_CONFIG[task.priority].label}
                      </Tag>
                      <Avatar 
                        size={32} 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.id}`} 
                        style={{ border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: '#f1f5f9' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Right Column - Distributions */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
            
            <Card 
              className="modern-panel-card" 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>Mức độ ưu tiên</span>} 
              bordered={false}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => {
                  const count = tasks.filter((t) => t.priority === p).length;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={p}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                          {PRIORITY_CONFIG[p].label}
                        </span>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>{count}</Text>
                      </div>
                      <Progress
                        percent={pct}
                        showInfo={false}
                        strokeColor={PRIORITY_CONFIG[p].color}
                        trailColor="#f1f5f9"
                        size="small"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card 
              className="modern-panel-card" 
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>Tiến độ tổng thể</span>} 
              bordered={false}
              style={{ flex: 1 }}
            >
              <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                 <Progress
                    type="circle"
                    percent={total > 0 ? Math.round((doneCount / total) * 100) : 0}
                    strokeColor={{
                      '0%': '#6366f1',
                      '100%': '#2dd4bf',
                    }}
                    strokeWidth={8}
                    width={140}
                    format={(pct) => (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{pct}%</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>Đã xong</span>
                      </div>
                    )}
                  />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Cần làm</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{todoCount}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Đang xử lý</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#f59e0b' }}>{inProgressCount}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Quá hạn</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>{overdueCount}</div>
                 </div>
              </div>
            </Card>

          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTab;
