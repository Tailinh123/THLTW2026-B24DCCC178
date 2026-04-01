import React from 'react';
import { Modal, Table, Tag } from 'antd';
import type { LichSuThaoTac } from '../types';

interface Props {
  open: boolean;
  history: LichSuThaoTac[];
  onCancel: () => void;
}

const HistoryModal: React.FC<Props> = ({ open, history, onCancel }) => {
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      width: 160,
    },
    {
      title: 'Thao tác',
      dataIndex: 'thaoTac',
      width: 130,
      render: (v: string) => {
        const colorMap: Record<string, string> = {
          'Thêm CLB': 'blue',
          'Sửa CLB': 'cyan',
          'Xóa CLB': 'red',
          'Thêm đơn': 'blue',
          'Sửa đơn': 'cyan',
          'Xóa đơn': 'red',
          'Duyệt đơn': 'success',
          'Từ chối đơn': 'error',
          'Đổi CLB': 'purple',
        };
        return <Tag color={colorMap[v] || 'default'}>{v}</Tag>;
      },
    },
    {
      title: 'Đối tượng',
      dataIndex: 'doiTuong',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      render: (v: string) => v || '—',
    },
  ];

  return (
    <Modal
      visible={open}
      title="Lịch sử thao tác"
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table
        rowKey="id"
        size="small"
        dataSource={history}
        columns={columns}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Chưa có lịch sử thao tác' }}
        style={{ marginTop: 8 }}
      />
    </Modal>
  );
};

export default HistoryModal;
