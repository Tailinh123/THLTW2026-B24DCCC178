import { Modal, Form, Input, InputNumber } from 'antd';
import { Product } from './types';

interface Props {
  open: boolean;
  onCancel: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

const ProductFormModal = ({ open, onCancel, onAdd }: Props) => {
  const [form] = Form.useForm();

  const onFinish = (values: Omit<Product, 'id'>) => {
    onAdd(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm sản phẩm mới"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá' },
            { min: 1, message: 'Giá phải là số dương' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { min: 1, message: 'Số lượng phải > 0' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
