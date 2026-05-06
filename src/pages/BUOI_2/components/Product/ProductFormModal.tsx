import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { Product, ProductFormValues } from '../../types';
import { PRODUCT_CATEGORIES } from '../../constants';

interface ProductFormModalProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
  onSubmit: (id: number, values: ProductFormValues) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  product,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
      });
    }
  }, [visible, product, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (product) {
        onSubmit(product.id, values);
      }
      form.resetFields();
      onCancel();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Sửa sản phẩm"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" size="large" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Chọn danh mục" size="large">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VNĐ)"
          rules={[
            { required: true, message: 'Vui lòng nhập giá' },
            { type: 'number', min: 1000, message: 'Giá tối thiểu 1.000đ' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value) => value!.replace(/\./g, '') as any}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng tồn kho"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { type: 'number', min: 0, message: 'Số lượng không được âm' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            precision={0}
            placeholder="0"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
