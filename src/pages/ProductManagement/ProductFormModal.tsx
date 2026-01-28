import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { Product } from './types';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  initialValues?: Product | null;
}

const { Option } = Select;

const ProductFormModal = ({ open, onCancel, onSave, initialValues }: Props) => {
  const [form] = Form.useForm();
  const isEditMode = !!initialValues;

  const onFinish = (values: any) => {
    if (isEditMode && initialValues && initialValues.id) {
      onSave({ ...initialValues, ...values });
      message.success('Cập nhật sản phẩm thành công');
    } else {
      onSave(values);
      message.success('Thêm sản phẩm thành công');
    }
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Form validation failed:', errorInfo);
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      form.submit();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={
          isEditMode
            ? initialValues
            : { name: '', category: '', price: undefined, quantity: undefined }
        }
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm' },
            { min: 3, message: 'Tên sản phẩm phải ít nhất 3 ký tự' },
            { max: 100, message: 'Tên sản phẩm tối đa 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Chọn danh mục sản phẩm">
            <Option value="Laptop">Laptop</Option>
            <Option value="Điện thoại">Điện thoại</Option>
            <Option value="Máy tính bảng">Máy tính bảng</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá (VND)"
          name="price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá sản phẩm' },
            {
              type: 'number',
              min: 1,
              message: 'Giá sản phẩm phải lớn hơn 0',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            placeholder="Nhập giá sản phẩm"
            formatter={(value) => {
              if (!value) return '';
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
            parser={(value) => {
              const val = value?.replace(/,/g, '') || '';
              return parseInt(val) || 0;
            }}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            {
              type: 'number',
              min: 0,
              message: 'Số lượng không được âm',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Nhập số lượng tồn kho"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
