import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { ProductFormValues } from '../types';

interface ProductFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<ProductFormValues>();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Thêm sản phẩm mới"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Thêm"
      cancelText="Hủy"
      destroyOnClose
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
            { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng!' },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VNĐ)"
          rules={[
            { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
            {
              type: 'number',
              min: 1,
              message: 'Giá phải là số dương!',
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập giá sản phẩm"
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            parser={(value) =>
              Number(value?.replace(/\./g, '') || 0)
            }
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            {
              type: 'number',
              min: 1,
              message: 'Số lượng phải là số nguyên dương!',
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số lượng"
            style={{ width: '100%' }}
            min={1}
            precision={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
