import React, { useState } from 'react';
import { Modal, Select, Typography } from 'antd';
import type { CauLacBo } from '../types';

interface Props {
  open: boolean;
  memberCount: number;
  clubs: CauLacBo[];
  onCancel: () => void;
  onConfirm: (newClubId: string) => void;
}

const { Text } = Typography;

const TransferClubModal: React.FC<Props> = ({ open, memberCount, clubs, onCancel, onConfirm }) => {
  const [selectedClub, setSelectedClub] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setSelectedClub(undefined);
      setError('');
    }
  }, [open]);

  const handleOk = () => {
    if (!selectedClub) {
      setError('Vui lòng chọn CLB mới');
      return;
    }
    onConfirm(selectedClub);
  };

  return (
    <Modal
      visible={open}
      title="Đổi Câu lạc bộ cho thành viên"
      onCancel={onCancel}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Text>
          Bạn đang đổi CLB cho <b style={{ color: '#1677ff' }}>{memberCount}</b> thành viên.
        </Text>
      </div>
      <div>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
          CLB mới <span style={{ color: '#ff4d4f' }}>*</span>
        </label>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn câu lạc bộ mới"
          value={selectedClub}
          onChange={(v) => {
            setSelectedClub(v);
            setError('');
          }}
        >
          {clubs.map((c) => (
            <Select.Option key={c.id} value={c.id}>{c.tenCLB}</Select.Option>
          ))}
        </Select>
        {error && <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 12 }}>{error}</div>}
      </div>
    </Modal>
  );
};

export default TransferClubModal;
