import { useEffect, useMemo, useState } from 'react';
import { Form, Input, Modal, Select, Divider, InputNumber, Space, Row, Col, message } from 'antd';
import { Product, Order, OrderProduct } from './types';

interface Props {
  open: boolean;
  onCancel: () => void;
  onCreate: (order: Order) => void;
  products: Product[];
}

const OrderFormModal = ({ open, onCancel, onCreate, products }: Props) => {
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTotalAmount(0);
    }
  }, [open, form]);

  const productMap = useMemo(() => {
    const map: Record<number, Product> = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  const calculateTotal = () => {
    const values = form.getFieldsValue();
    const selectedProducts = values.productIds || [];
    
    let total = 0;
    selectedProducts.forEach((productId: number) => {
      const quantity = values[`qty_${productId}`] || 0;
      const product = productMap[productId];
      if (product && quantity > 0) {
        total += quantity * product.price;
      }
    });
    
    setTotalAmount(total);
  };

  const handleFinish = (values: any) => {
    const { customerName, phone, address, productIds } = values;
    
    if (!productIds || productIds.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }

    const orderProducts: OrderProduct[] = productIds.map((productId: number) => {
      const quantity = values[`qty_${productId}`] || 1;
      const product = productMap[productId];
      
      return {
        productId: productId,
        productName: product.name,
        quantity: quantity,
        price: product.price
      };
    });

    for (const op of orderProducts) {
      const stock = productMap[op.productId].quantity;
      if (op.quantity > stock) {
        message.error(`Số lượng đặt cho ${op.productName} vượt quá tồn kho (Có sẵn: ${stock})`);
        return;
      }
    }

    const total = orderProducts.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const id = 'DH' + Date.now();
    const createdAt = new Date().toISOString().slice(0, 10);
    
    const newOrder: Order = {
      id,
      customerName,
      phone,
      address,
      products: orderProducts,
      totalAmount: total,
      status: 'Chờ xử lý',
      createdAt
    } as Order;

    onCreate(newOrder);
    message.success('Tạo đơn hàng thành công');
    form.resetFields();
  };

  const phoneRule = {
    pattern: /^\d{10,11}$/,
    message: 'Số điện thoại phải có 10-11 chữ số'
  };

  return (
    <Modal 
      title="Tạo đơn hàng mới" 
      visible={open} 
      onCancel={onCancel} 
      onOk={() => form.submit()} 
      destroyOnClose
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish}
        onValuesChange={calculateTotal}
      >
        <Form.Item 
          label="Tên khách hàng" 
          name="customerName" 
          rules={[
            { required: true, message: 'Vui lòng nhập tên khách hàng' }
          ]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item 
          label="Số điện thoại" 
          name="phone" 
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            phoneRule
          ]}
        >
          <Input placeholder="Nhập số điện thoại (10-11 chữ số)" />
        </Form.Item>

        <Form.Item 
          label="Địa chỉ" 
          name="address" 
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ' }
          ]}
        >
          <Input placeholder="Nhập địa chỉ giao hàng" />
        </Form.Item>

        <Divider />

        <Form.Item 
          label="Chọn sản phẩm" 
          name="productIds" 
          rules={[
            { required: true, message: 'Vui lòng chọn ít nhất 1 sản phẩm' }
          ]}
        >
          <Select 
            mode="multiple" 
            placeholder="Chọn các sản phẩm cần đặt"
            optionLabelProp="label"
          >
            {products.map((p) => {
              const available = p.quantity > 0;
              const displayText = `${p.name} - Giá: ${p.price.toLocaleString()} VND - Có sẵn: ${p.quantity}`;
              return (
                <Select.Option 
                  key={p.id} 
                  value={p.id} 
                  label={displayText}
                  disabled={!available}
                >
                  {displayText}
                  {!available && ' (Hết hàng)'}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Space direction="vertical" style={{ width: '100%' }}>
          {products.map((product) => (
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.productIds !== cur.productIds} key={product.id}>
              {({ getFieldValue }) => {
                const selectedProducts: number[] = getFieldValue('productIds') || [];
                if (!selectedProducts.includes(product.id)) {
                  return null;
                }
                
                return (
                  <Form.Item 
                    label={`Số lượng - ${product.name}`} 
                    name={`qty_${product.id}`} 
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượng' },
                      { type: 'number', min: 1, message: 'Số lượng phải >= 1' },
                      { 
                        type: 'number', 
                        max: product.quantity, 
                        message: `Số lượng không được vượt quá ${product.quantity}` 
                      }
                    ]}
                  >
                    <InputNumber 
                      min={1} 
                      max={product.quantity}
                      placeholder={`Tối đa ${product.quantity}`}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          ))}
        </Space>

        <Divider />
        <Row style={{ marginTop: 16 }}>
          <Col span={12}>
            <strong>Tổng tiền đơn hàng:</strong>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 16, color: '#d9534f' }}>
              <strong>{totalAmount.toLocaleString()} VND</strong>
            </span>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default OrderFormModal;
