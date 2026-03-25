import React, { useState } from 'react';
import { Table, Button, Card, Popconfirm, Space, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CauHinhTruong, KieuDuLieu } from '../types';

interface Props {
  data: CauHinhTruong[];
  onAdd: (data: Omit<CauHinhTruong, 'id'>) => void;
  onEdit: (id: string, data: Partial<CauHinhTruong>) => void;
  onDelete: (id: string) => void;
}

const TYPE_COLOR: Record<KieuDuLieu, string> = {
  String: 'blue',
  Number: 'green',
  Date: 'orange',
};

const CauHinhBieuMauPage: React.FC<Props> = ({ data, onAdd, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CauHinhTruong | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: CauHinhTruong) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        onEdit(editing.id, values);
      } else {
        onAdd(values);
      }
      setModalOpen(false);
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Tên trường',
      dataIndex: 'tenTruong',
      sorter: (a: CauHinhTruong, b: CauHinhTruong) => a.tenTruong.localeCompare(b.tenTruong),
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      sorter: (a: CauHinhTruong, b: CauHinhTruong) => a.kieuDuLieu.localeCompare(b.kieuDuLieu),
      render: (type: KieuDuLieu) => <Tag color={TYPE_COLOR[type]}>{type}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: CauHinhTruong) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xác nhận xóa trường này?" onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<span style={{ fontWeight: 600 }}>Cấu hình trường thông tin phụ lục văn bằng</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#9B1B30', borderColor: '#9B1B30' }}>
            Thêm trường
          </Button>
        }
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={editing ? 'Chỉnh sửa trường thông tin' : 'Thêm trường thông tin mới'}
        visible={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#9B1B30', borderColor: '#9B1B30' } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tenTruong" label="Tên trường" rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}>
            <Input placeholder="VD: Nơi sinh, Xếp loại..." />
          </Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Vui lòng chọn kiểu' }]}>
            <Select placeholder="Chọn kiểu dữ liệu">
              <Select.Option value="String">String (Chuỗi ký tự)</Select.Option>
              <Select.Option value="Number">Number (Số)</Select.Option>
              <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CauHinhBieuMauPage;
