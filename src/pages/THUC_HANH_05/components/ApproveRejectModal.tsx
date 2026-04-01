import React, { useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  open: boolean;
  mode: 'approve' | 'reject';
  count: number;
  onCancel: () => void;
  onConfirm: (lyDo: string) => void;
}

const { TextArea } = Input;
const { Text } = Typography;

const ApproveRejectModal: React.FC<Props> = ({ open, mode, count, onCancel, onConfirm }) => {
  const [lyDo, setLyDo] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setLyDo('');
      setError('');
    }
  }, [open]);

  const handleOk = () => {
    if (mode === 'reject' && !lyDo.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }
    onConfirm(lyDo.trim());
  };

  return (
    <Modal
      visible={open}
      title={
        <span style={{ color: mode === 'approve' ? '#52c41a' : '#ff4d4f' }}>
          <ExclamationCircleOutlined style={{ marginRight: 8 }} />
          {mode === 'approve' ? 'Xác nhận duyệt đơn' : 'Xác nhận từ chối đơn'}
        </span>
      }
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === 'approve' ? 'Duyệt' : 'Từ chối'}
      cancelText="Hủy"
      okButtonProps={{ danger: mode === 'reject' }}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Text>
          Bạn sắp <b>{mode === 'approve' ? 'duyệt' : 'từ chối'}</b>{' '}
          <b style={{ color: '#1677ff' }}>{count}</b> đơn đăng ký.
        </Text>
      </div>

      {mode === 'reject' && (
        <Form layout="vertical">
          <Form.Item
            label="Lý do từ chối"
            required
            validateStatus={error ? 'error' : ''}
            help={error}
          >
            <TextArea
              rows={3}
              placeholder="Nhập lý do từ chối..."
              value={lyDo}
              onChange={(e) => {
                setLyDo(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ApproveRejectModal;
