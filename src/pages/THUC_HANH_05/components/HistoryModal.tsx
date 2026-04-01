import React from 'react';
import { Modal, Table, Tag } from 'antd';
import type { LichSuThaoTac } from '../types';

interface Props { open: boolean; history: LichSuThaoTac[]; onCancel: () => void; }

const HistoryModal: React.FC<Props> = ({ open, history, onCancel }) => {
  const colorMap: Record<string, string> = {
    'Thêm CLB': 'blue', 'Sửa CLB': 'cyan', 'Xóa CLB': 'red',
    'Thêm đơn': 'blue', 'Sửa đơn': 'cyan', 'Xóa đơn': 'red',
    'Duyệt đơn': 'success', 'Từ chối đơn': 'error', 'Đổi CLB': 'purple',
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'thoiGian', width: 160 },
    { title: 'Thao tác', dataIndex: 'thaoTac', width: 130, render: (v: string) => <Tag className="clb-tag-status" color={colorMap[v] || 'default'}>{v}</Tag> },
    { title: 'Đối tượng', dataIndex: 'doiTuong', render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Ghi chú', dataIndex: 'ghiChu', render: (v: string) => v || '—' },
  ];

  return (
    <Modal visible={open} title="Lịch sử thao tác" onCancel={onCancel} footer={null} width={800} wrapClassName="clb-modal" centered>
      <Table rowKey="id" size="small" dataSource={history} columns={columns} pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Chưa có lịch sử thao tác' }} />
    </Modal>
  );
};

export default HistoryModal;
