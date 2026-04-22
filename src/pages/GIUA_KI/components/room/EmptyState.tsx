import React from 'react';
import { Button, Space } from 'antd';
import { Building2, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddRoom: () => void;
  onLoadDefaults: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddRoom, onLoadDefaults }) => {
  return (
    <div className="gk-empty-state">
      <div className="gk-empty-state__icon">
        <Building2 size={36} />
      </div>
      <div className="gk-empty-state__title">
        Chưa có phòng học nào
      </div>
      <div className="gk-empty-state__desc">
        Bắt đầu bằng cách thêm phòng mới hoặc tải dữ liệu mẫu để khám phá hệ thống
      </div>
      <div className="gk-empty-state__actions">
        <Button
          type="primary"
          className="gk-btn-primary"
          icon={<Plus size={16} />}
          onClick={onAddRoom}
        >
          Thêm phòng mới
        </Button>
        <Button
          icon={<RotateCcw size={14} />}
          onClick={onLoadDefaults}
        >
          Tải dữ liệu mẫu
        </Button>
      </div>
    </div>
  );
};

export default React.memo(EmptyState);
