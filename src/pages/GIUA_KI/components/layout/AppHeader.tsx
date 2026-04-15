

import React from 'react';
import { Layout, Button, Popconfirm, Tooltip, Space } from 'antd';
import { Sun, Moon, RotateCcw, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useRooms } from '../../hooks/useRooms';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggleCollapse }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { resetToDefaults } = useRooms();

  return (
    <Header className="gk-header">
      <div className="gk-header__left">
        <Button
          type="text"
          className="gk-header-btn"
          onClick={onToggleCollapse}
          style={{ padding: '0 8px' }}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <Menu size={18} />
        </Button>
        <h1 className="gk-header__title">Room Management</h1>
      </div>

      <div className="gk-header__right">
        {/* Reset to Default */}
        <Popconfirm
          title="Đặt lại dữ liệu mẫu?"
          description="Thao tác này sẽ thay thế toàn bộ dữ liệu phòng hiện tại bằng 10 phòng mẫu."
          onConfirm={resetToDefaults}
          okText="Đồng ý"
          cancelText="Hủy"
          placement="bottomRight"
        >
          <Tooltip title="Tải dữ liệu mẫu" placement="bottom">
            <Button className="gk-header-btn" aria-label="Đặt lại dữ liệu mẫu">
              <RotateCcw size={15} />
              <span>Reset</span>
            </Button>
          </Tooltip>
        </Popconfirm>

        {/* Dark Mode Toggle */}
        <Tooltip title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'} placement="bottom">
          <Button
            className="gk-header-btn"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Tooltip>

        {/* User Avatar */}
        <Tooltip title="Admin" placement="bottomRight">
          <div className="gk-header-avatar" aria-label="User avatar">
            A
          </div>
        </Tooltip>
      </div>
    </Header>
  );
};

export default React.memo(AppHeader);
