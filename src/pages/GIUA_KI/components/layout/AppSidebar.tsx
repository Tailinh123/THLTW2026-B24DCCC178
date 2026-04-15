

import React from 'react';
import { Layout, Menu } from 'antd';
import { Building2, DoorOpen, CalendarDays, BarChart3, Settings } from 'lucide-react';

const { Sider } = Layout;

const ICON_MAP: Record<string, React.ReactNode> = {
  DoorOpen: <DoorOpen size={18} />,
  CalendarDays: <CalendarDays size={18} />,
  BarChart3: <BarChart3 size={18} />,
  Settings: <Settings size={18} />,
};

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const MENU_ITEMS = [
  {
    key: 'rooms',
    icon: <DoorOpen size={18} />,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Quản lý phòng
      </span>
    ),
    disabled: false,
  },
  { type: 'divider' as const, key: 'div-1' },
  {
    key: 'schedule',
    icon: <CalendarDays size={18} />,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Lịch sử dụng
        <span className="gk-sidebar-badge">Soon</span>
      </span>
    ),
    disabled: true,
  },
  {
    key: 'reports',
    icon: <BarChart3 size={18} />,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Báo cáo
        <span className="gk-sidebar-badge">Soon</span>
      </span>
    ),
    disabled: true,
  },
  {
    key: 'settings',
    icon: <Settings size={18} />,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        Cài đặt
        <span className="gk-sidebar-badge">Soon</span>
      </span>
    ),
    disabled: true,
  },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onCollapse }) => {
  return (
    <Sider
      className="gk-sidebar"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={252}
      collapsedWidth={80}
      theme="light"
      trigger={null}
    >
      {}
      <div className="gk-sidebar-logo">
        <div className="gk-sidebar-logo__icon">
          <Building2 size={20} />
        </div>
        {!collapsed && (
          <span className="gk-sidebar-logo__text">UniRoom</span>
        )}
      </div>

      {}
      <Menu
        className="gk-sidebar-menu"
        mode="inline"
        selectedKeys={['rooms']}
        items={MENU_ITEMS}
        style={{ borderRight: 'none' }}
      />

      {}
      {!collapsed && (
        <div className="gk-sidebar-footer">
          <div className="gk-sidebar-footer__version">v1.0.0 — Giữa kỳ</div>
        </div>
      )}
    </Sider>
  );
};

export default React.memo(AppSidebar);
