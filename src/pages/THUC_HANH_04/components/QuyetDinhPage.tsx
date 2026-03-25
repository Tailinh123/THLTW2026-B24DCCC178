import React, { useState } from 'react';
import { Table, Button, Card, Popconfirm, Space, Tag, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuyetDinhTotNghiep } from '../types';

interface Props {
  data: QuyetDinhTotNghiep[];
  onAdd: (data: Omit<QuyetDinhTotNghiep, 'id' | 'luotTraCuu'>) => void;
  onEdit: (id: string, data: Partial<QuyetDinhTotNghiep>) => void;
  onDelete: (id: string) => void;
}

const QuyetDinhPage: React.FC<Props> = ({ data, onAdd, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<QuyetDinhTotNghiep | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: QuyetDinhTotNghiep) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      ngayBanHanh: moment(record.ngayBanHanh),
    });
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const payload = {
        ...values,
        ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
      };
      if (editing) {
        onEdit(editing.id, payload);
      } else {
        onAdd(payload);
      }
      setModalOpen(false);
    });
  };

  const columns = [
    {
      title: 'Số quyết định',
      dataIndex: 'soQuyetDinh',
      sorter: (a: QuyetDinhTotNghiep, b: QuyetDinhTotNghiep) => a.soQuyetDinh.localeCompare(b.soQuyetDinh),
      render: (text: string) => <Tag color="processing">{text}</Tag>,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      sorter: (a: QuyetDinhTotNghiep, b: QuyetDinhTotNghiep) => a.ngayBanHanh.localeCompare(b.ngayBanHanh),
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      ellipsis: true,
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'luotTraCuu',
      sorter: (a: QuyetDinhTotNghiep, b: QuyetDinhTotNghiep) => a.luotTraCuu - b.luotTraCuu,
      render: (count: number) => <Tag color={count > 0 ? 'green' : 'default'}>{count}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: QuyetDinhTotNghiep) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xác nhận xóa quyết định này?" onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<span style={{ fontWeight: 600 }}>Danh sách quyết định tốt nghiệp</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#9B1B30', borderColor: '#9B1B30' }}>
            Thêm quyết định
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
        title={editing ? 'Chỉnh sửa quyết định' : 'Thêm quyết định mới'}
        visible={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#9B1B30', borderColor: '#9B1B30' } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="soQuyetDinh" label="Số quyết định" rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}>
            <Input placeholder="VD: QĐ-001/2024" />
          </Form.Item>
          <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="trichYeu" label="Trích yếu" rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}>
            <Input.TextArea rows={3} placeholder="Trích yếu nội dung quyết định..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuyetDinhPage;
