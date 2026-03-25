/* ============================================================
 * SoVanBangPage — Quản lý Sổ văn bằng (CRUD)
 * ============================================================ */
import React, { useState } from 'react';
import { Table, Button, Card, Popconfirm, Space, Modal, Form, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { SoVanBang } from '../types';

interface Props {
  data: SoVanBang[];
  onAdd: (data: Omit<SoVanBang, 'id'>) => void;
  onEdit: (id: string, data: Partial<SoVanBang>) => void;
  onDelete: (id: string) => void;
}

const SoVanBangPage: React.FC<Props> = ({ data, onAdd, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SoVanBang | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ nam: new Date().getFullYear(), soHienTai: 0 });
    setModalOpen(true);
  };

  const openEdit = (record: SoVanBang) => {
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
      title: 'Năm',
      dataIndex: 'nam',
      sorter: (a: SoVanBang, b: SoVanBang) => a.nam - b.nam,
      render: (nam: number) => (
        <span className="vb-tag-year">{nam}</span>
      ),
    },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'soHienTai',
      sorter: (a: SoVanBang, b: SoVanBang) => a.soHienTai - b.soHienTai,
      render: (val: number) => <span style={{ fontWeight: 600 }}>{val}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: SoVanBang) => (
        <Space size={4}>
          <Button type="text" className="vb-action-btn vb-action-edit" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xác nhận xóa sổ này?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="text" className="vb-action-btn vb-action-delete" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        className="vb-card"
        title="Danh sách sổ văn bằng"
        extra={
          <Button type="primary" className="vb-btn-primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm sổ
          </Button>
        }
      >
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={editing ? 'Chỉnh sửa sổ văn bằng' : 'Thêm sổ văn bằng mới'}
        visible={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        wrapClassName="vb-modal"
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nam" label="Năm" rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
            <InputNumber style={{ width: '100%' }} min={2000} max={2099} />
          </Form.Item>
          <Form.Item name="soHienTai" label="Số vào sổ hiện tại" rules={[{ required: true, message: 'Vui lòng nhập số' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SoVanBangPage;
