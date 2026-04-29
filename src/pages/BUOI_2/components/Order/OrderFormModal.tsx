import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, Select, InputNumber, Divider, Typography, Row, Col, Space } from 'antd';
import { Product, OrderProduct } from '../../types';

const { Text } = Typography;

interface OrderFormModalProps {
  visible: boolean;
  products: Product[];
  onCancel: () => void;
  onSubmit: (customerName: string, products: OrderProduct[]) => void;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  visible,
  products,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);

  const availableProducts = useMemo(
    () => products.filter((p) => p.quantity > 0),
    [products],
  );

  const totalAmount = useMemo(
    () => selectedProducts.reduce((sum, sp) => sum + sp.price * sp.quantity, 0),
    [selectedProducts],
  );

  const handleProductSelect = (productIds: number[]) => {
    const newSelected = productIds.map((pid) => {
      const existing = selectedProducts.find((sp) => sp.productId === pid);
      if (existing) return existing;
      const product = products.find((p) => p.id === pid)!;
      return {
        productId: pid,
        productName: product.name,
        quantity: 1,
        price: product.price,
      };
    });
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: number, qty: number) => {
    setSelectedProducts((prev) =>
      prev.map((sp) => (sp.productId === productId ? { ...sp, quantity: qty } : sp)),
    );
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (selectedProducts.length === 0) return;
      onSubmit(values.customerName, selectedProducts);
      form.resetFields();
      setSelectedProducts([]);
      onCancel();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProducts([]);
    onCancel();
  };

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Tạo đơn"
      cancelText="Hủy"
      okButtonProps={{ disabled: selectedProducts.length === 0 }}
      destroyOnClose
      width={640}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
        >
          <Input placeholder="Nhập tên khách hàng" size="large" />
        </Form.Item>

        <Form.Item label="Chọn sản phẩm">
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm để thêm vào đơn"
            size="large"
            style={{ width: '100%' }}
            onChange={handleProductSelect}
            optionLabelProp="label"
          >
            {availableProducts.map((p) => (
              <Select.Option key={p.id} value={p.id} label={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.name}</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Kho: {p.quantity} | {formatVND(p.price)}
                  </Text>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedProducts.length > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <Text strong style={{ color: '#64748b', textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5 }}>
              Chi tiết đơn hàng
            </Text>

            {selectedProducts.map((sp) => {
              const product = products.find((p) => p.id === sp.productId);
              const maxQty = product ? product.quantity : 1;
              return (
                <Row
                  key={sp.productId}
                  gutter={12}
                  align="middle"
                  style={{
                    marginTop: 12,
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: 8,
                  }}
                >
                  <Col span={12}>
                    <Text strong>{sp.productName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatVND(sp.price)} / sp
                    </Text>
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      min={1}
                      max={maxQty}
                      value={sp.quantity}
                      size="small"
                      onChange={(val) => handleQuantityChange(sp.productId, val || 1)}
                    />
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    <Text strong style={{ color: '#6366f1' }}>
                      {formatVND(sp.price * sp.quantity)}
                    </Text>
                  </Col>
                </Row>
              );
            })}

            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text strong style={{ fontSize: 15 }}>Tổng cộng:</Text>
              <Text strong style={{ fontSize: 20, color: '#6366f1' }}>
                {formatVND(totalAmount)}
              </Text>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default OrderFormModal;
