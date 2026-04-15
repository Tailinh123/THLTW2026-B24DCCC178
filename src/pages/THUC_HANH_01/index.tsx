import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Layout, Menu, Typography, Badge, Space, Tooltip } from 'antd';
import { BookOutlined, DashboardOutlined, TrophyOutlined, FolderOutlined, CalendarOutlined, AimOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { store } from './redux/store';
import DashboardModule from './modules/study/DashboardModule';
import GameModule from './modules/game/GameModule';
import CategoryModule from './modules/study/CategoryModule';
import StudyLogModule from './modules/study/StudyLogModule';
import GoalModule from './modules/study/GoalModule';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MENU_ITEMS = [
  { key: "dashboard",   icon: <DashboardOutlined />,   label: "Dashboard" },
  { key: "game",        icon: <TrophyOutlined />,      label: "Guessing Game" },
  { key: "divider",     type: "divider" as const },
  { key: "category",    icon: <FolderOutlined />,      label: "Danh mục môn" },
  { key: "log",         icon: <CalendarOutlined />,    label: "Lịch học" },
  { key: "goal",        icon: <AimOutlined />,         label: "Mục tiêu" },
];

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("dashboard");

  const pageMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardModule />,
    game: <GameModule />,
    category: <CategoryModule />,
    log: <StudyLogModule />,
    goal: <GoalModule />,
  };

  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard Tổng quan",
    game: "Number Guessing Game",
    category: "Quản lý Danh mục",
    log: "Lịch học",
    goal: "Mục tiêu Hàng tháng",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        style={{
          borderRight: `1px solid #f0f0f0`,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
        width={220}
      >
        <div style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
          borderBottom: `1px solid #f0f0f0`,
          gap: 8,
        }}>
          <BookOutlined style={{ fontSize: 22, color: '#1890ff' }} />
          {!collapsed && (
            <Text strong style={{ fontSize: 15, color: '#1890ff', whiteSpace: "nowrap" }}>
              Study App
            </Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[page]}
          items={MENU_ITEMS}
          onClick={({ key }) => { if (key !== "divider") setPage(key); }}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: '#ffffff',
          borderBottom: `1px solid #f0f0f0`,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <Title level={4} style={{ margin: 0 }}>{pageTitles[page]}</Title>
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs().format("dddd, DD/MM/YYYY")}
            </Text>
            <Tooltip title="Dữ liệu được tự động lưu vào localStorage">
              <Badge status="success" text={<Text style={{ fontSize: 12 }} type="secondary">Auto-saved</Text>} />
            </Tooltip>
          </Space>
        </Header>

        <Content style={{
          margin: 24,
          minHeight: "calc(100vh - 112px)",
        }}>
          {pageMap[page]}
        </Content>
      </Layout>
    </Layout>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
