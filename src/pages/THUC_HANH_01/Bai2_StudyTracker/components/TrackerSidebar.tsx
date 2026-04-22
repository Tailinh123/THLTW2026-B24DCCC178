import React from 'react';
import {
  DashboardOutlined,
  BookOutlined,
  HistoryOutlined,
  AimOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styles from '../index.less';

type TabKey = 'overview' | 'subjects' | 'sessions' | 'goals';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenSettings: () => void;
}

const menuItems: { key: TabKey; icon: React.ReactNode; label: string }[] = [
  { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: 'subjects', icon: <BookOutlined />, label: 'Môn học' },
  { key: 'sessions', icon: <HistoryOutlined />, label: 'Lịch sử' },
  { key: 'goals', icon: <AimOutlined />, label: 'Mục tiêu' },
];

const TrackerSidebar: React.FC<Props> = ({ activeTab, onTabChange, onOpenSettings }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon}>
            <BookOutlined />
          </div>
          <div>
            <div className={styles.sidebarLogoText}>StudyFlow</div>
            <span className={styles.sidebarLogoSub}>Quản lý học tập</span>
          </div>
        </div>
      </div>

      <div className={styles.sidebarMenu}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.menuItem} ${activeTab === item.key ? styles.menuItemActive : ''}`}
            onClick={() => onTabChange(item.key)}
            type="button"
          >
            <span className={styles.menuItemIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.sidebarFooter}>
        <button
          className={styles.sidebarFooterBtn}
          onClick={onOpenSettings}
          type="button"
        >
          <SettingOutlined />
          <span>Cài đặt Môn học</span>
        </button>
      </div>
    </div>
  );
};

export default TrackerSidebar;
