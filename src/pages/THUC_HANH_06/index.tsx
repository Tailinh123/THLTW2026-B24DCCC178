import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Layout, Menu, Typography, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import store, { useAppDispatch } from './store';
import { destActions, itinActions, budgetActions } from './slices';
import { api } from './services';
import { ROUTES, PAGE_TITLES } from './routes';
import type { PageKey } from './types';
import './styles.less';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const AppContent: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home');
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(destActions.setLoading(true));
      const dests = await api.getDestinations();
      dispatch(destActions.setDestinations(dests));
      const itin = await api.getItinerary();
      dispatch(itinActions.setItinerary(itin));
      const budget = await api.getBudget();
      dispatch(budgetActions.setThreshold(budget));
    })();
  }, [dispatch]);

  const ActivePage = ROUTES.find((r) => r.key === page)?.component || ROUTES[0].component;

  return (
    <Layout className="th06-layout">
      <Sider
        className="th06-sider"
        width={260}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
      >
        {}
        <div className="th06-logo">
          <div className="th06-logo-icon">
            <CompassOutlined style={{ fontSize: 22, color: '#fff' }} />
          </div>
          {!collapsed && <span className="th06-logo-text">Travel Planner</span>}
        </div>

        {}
        {!collapsed && <div className="th06-nav-section">Điều hướng</div>}

        {}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          onClick={({ key }) => setPage(key as PageKey)}
          items={ROUTES.map((r) => ({
            key: r.key,
            icon: r.icon,
            label: r.label,
          }))}
        />

        {}
        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: 20,
            right: 20,
            padding: '16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.15), rgba(114, 46, 209, 0.1))',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
              ✨ Lên kế hoạch du lịch hoàn hảo cùng Travel Planner
            </Text>
          </div>
        )}
      </Sider>

      <Layout>
        <Header className="th06-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
            <span className="th06-header-title">{PAGE_TITLES[page]}</span>
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Travel Planning App
          </Text>
        </Header>
        <Content className="th06-content">
          <ActivePage />
        </Content>
      </Layout>
    </Layout>
  );
};

const THUC_HANH_06: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default THUC_HANH_06;
