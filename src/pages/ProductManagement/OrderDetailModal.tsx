import { Modal, Table, Divider, Row, Col } from 'antd';
import { Order } from './types';

interface Props {
  open: boolean;
  onCancel: () => void;
  order?: Order | null;
}

const OrderDetailModal = ({ open, onCancel, order }: Props) => {
  if (!order) return null;

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      render: (value: number) => value.toLocaleString(),
      width: 120,
    },
    {
      title: 'Thành tiền (VND)',
      render: (text: any, record: any) =>
        (record.quantity * record.price).toLocaleString(),
      width: 140,
    },
  ];

  return (
    <Modal
      title={`Chi tiết đơn hàng ${order.id}`}
      visible={open}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div style={{ marginBottom: 20 }}>
        <h3>Thông tin khách hàng</h3>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>Tên khách hàng:</strong> {order.customerName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.phone}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>Địa chỉ:</strong> {order.address}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {order.createdAt}
            </p>
          </Col>
        </Row>
      </div>

      <Divider />

      <div style={{ marginBottom: 20 }}>
        <h3>Chi tiết sản phẩm</h3>
        <Table
          rowKey={(record: any) => record.productId}
          columns={productColumns}
          dataSource={order.products}
          pagination={false}
          size="small"
        />
      </div>

      <Divider />

      <div style={{ marginBottom: 20 }}>
        <h3>Tóm tắt đơn hàng</h3>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>Trạng thái:</strong> {order.status}
            </p>
            <p>
              <strong>Số sản phẩm:</strong> {order.products.length}
            </p>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 18, color: '#d9534f' }}>
              <strong>Tổng tiền: </strong>
              {order.totalAmount.toLocaleString()} VND
            </p>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
