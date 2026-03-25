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

const TYPE_COLOR: Record<KieuDuLieu, string> = { String: 'blue', Number: 'green', Date: 'orange' };

const CauHinhBieuMauPage: React.FC<Props> = ({ data, onAdd, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CauHinhTruong | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: CauHinhTruong) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };
  const handleOk = () => {
    form.validateFields().then(v => {
      editing ? onEdit(editing.id, v) : onAdd(v);
      setModalOpen(false);
    });
  };

  const columns = [
    { title: 'STT', key: 'stt', render: (_: any, __: any, i: number) => <span style={{ fontWeight: 600, color: '#64748b' }}>{i + 1}</span>, width: 60 },
    { title: 'Tên trường', dataIndex: 'tenTruong', sorter: (a: CauHinhTruong, b: CauHinhTruong) => a.tenTruong.localeCompare(b.tenTruong), render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', sorter: (a: CauHinhTruong, b: CauHinhTruong) => a.kieuDuLieu.localeCompare(b.kieuDuLieu), render: (t: KieuDuLieu) => <Tag className="vb-tag-type" color={TYPE_COLOR[t]}>{t}</Tag> },
    { title: 'Thao tác', key: 'action', width: 100, render: (_: any, r: CauHinhTruong) => (
      <Space size={4}>
        <Button type="text" className="vb-action-btn vb-action-edit" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(r.id)} okText="Xóa" cancelText="Hủy">
          <Button type="text" className="vb-action-btn vb-action-delete" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <>
      <Card className="vb-card" title="Cấu hình trường thông tin phụ lục văn bằng"
        extra={<Button type="primary" className="vb-btn-primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm trường</Button>}>
        <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 5, showSizeChanger: false }} />
      </Card>
      <Modal title={editing ? 'Chỉnh sửa trường thông tin' : 'Thêm trường thông tin mới'} visible={modalOpen}
        onOk={handleOk} onCancel={() => setModalOpen(false)} okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy" wrapClassName="vb-modal" centered destroyOnClose>
        <Form form={form} layout="vertical">
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
