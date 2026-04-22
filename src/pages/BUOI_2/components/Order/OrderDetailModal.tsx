import React from 'react';
import { Modal, Descriptions, Table, Typography, Tag } from 'antd';
import { Order } from '../../types';
import { ORDER_STATUS_COLORS } from '../../constants';

const { Title } = Typography;

interface OrderDetailModalProps {
  visible: boolean;
  order: Order | null;
  onCancel: () => void;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  onCancel,
}) => {
  if (!order) return null;

  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatVND(val)}</span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 600, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
          {formatVND(record.price * record.quantity)}
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={
        <span>
          Chi tiết đơn hàng{' '}
          <Tag color="geekblue" style={{ fontWeight: 600 }}>
            #{String(order.id).padStart(3, '0')}
          </Tag>
        </span>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={640}
    >
      <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Khách hàng" span={2}>
          <span style={{ fontWeight: 500 }}>{order.customerName}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{order.createdAt}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={ORDER_STATUS_COLORS[order.status]}>{order.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={2}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>
            {formatVND(order.totalAmount)}
          </span>
        </Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ marginBottom: 8 }}>Danh sách sản phẩm</Title>
      <Table
        dataSource={order.products}
        columns={productColumns}
        rowKey="productId"
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default OrderDetailModal;
