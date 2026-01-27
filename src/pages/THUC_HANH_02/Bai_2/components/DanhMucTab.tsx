
import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Empty,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { dmActions } from '../slices';
import type { KhoiKienThuc, MonHoc } from '../types';

const { TextArea } = Input;


const KhoiKienThucManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KhoiKienThuc | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (r: KhoiKienThuc) => {
    setEditing(r);
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((vals) => {
      if (editing) {
        dispatch(dmActions.updateKKT({ ...editing, ...vals }));
        message.success('Đã cập nhật khối kiến thức');
      } else {
        dispatch(dmActions.addKKT(vals));
        message.success('Đã thêm khối kiến thức mới');
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    const used = cauHois.some((c) => c.khoiKienThucId === id);
    if (used) {
      message.error('Không thể xóa! Có câu hỏi đang sử dụng khối kiến thức này');
      return;
    }
    dispatch(dmActions.deleteKKT(id));
    message.success('Đã xóa khối kiến thức');
  };

  const columns = [
    { 
      title: '#', 
      key: 'stt', 
      width: 60, 
      render: (_: any, __: any, i: number) => <span style={{ color: '#8c8c8c' }}>{i + 1}</span> 
    },
    { 
      title: 'Tên khối kiến thức', 
      dataIndex: 'ten', 
      key: 'ten', 
      ellipsis: true,
      render: (text: string) => <strong style={{ color: '#262626' }}>{text}</strong>
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'moTa', 
      key: 'moTa', 
      ellipsis: true,
      render: (text: string) => <span style={{ color: '#595959' }}>{text || '—'}</span>
    },
    {
      title: 'Số câu hỏi',
      key: 'count',
      width: 120,
      render: (_: any, r: KhoiKienThuc) => {
        const count = cauHois.filter((c) => c.khoiKienThucId === r.id).length;
        return <Tag color={count > 0 ? 'blue' : 'default'} style={{ borderRadius: 12, padding: '0 10px' }}>{count} câu</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: KhoiKienThuc) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" style={{ color: '#1890ff' }} icon={<EditOutlined />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc chắn muốn xóa khối kiến thức này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy" placement="topRight">
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<><AppstoreOutlined style={{ color: '#1890ff', marginRight: 8 }} /> Khối kiến thức ({khoiKienThucs.length})</>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 6 }}>
            Thêm khối kiến thức
          </Button>
        }
        bordered={false}
      >
        <Table
          dataSource={khoiKienThucs}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có khối kiến thức nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        />
      </Card>

      <Modal
        title={<div style={{ fontWeight: 600, fontSize: 16 }}>{editing ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức mới'}</div>}
        visible={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Lưu thông tin"
        cancelText="Hủy bỏ"
        centered
        width={500}
        wrapClassName="exam-admin-modal"
        okButtonProps={{ style: { borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên khối kiến thức" rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức' }]}>
            <Input placeholder="VD: Đại số, Hình học..." size="large" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả chi tiết">
            <TextArea rows={3} placeholder="Nhập mô tả ngắn gọn..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};


import { Tooltip } from 'antd';

const MonHocManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MonHoc | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (r: MonHoc) => {
    setEditing(r);
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((vals) => {
      if (editing) {
        dispatch(dmActions.updateMonHoc({ ...editing, ...vals }));
        message.success('Đã cập nhật môn học');
      } else {
        dispatch(dmActions.addMonHoc({ ...vals, khoiKienThucIds: vals.khoiKienThucIds || [] }));
        message.success('Đã thêm môn học mới');
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    const used = cauHois.some((c) => c.monHocId === id);
    if (used) {
      message.error('Không thể xóa! Có câu hỏi đang sử dụng môn học này');
      return;
    }
    dispatch(dmActions.deleteMonHoc(id));
    message.success('Đã xóa môn học');
  };

  const kktMap = new Map(khoiKienThucs.map((k) => [k.id, k.ten]));

  const columns = [
    { 
      title: '#', 
      key: 'stt', 
      width: 60, 
      render: (_: any, __: any, i: number) => <span style={{ color: '#8c8c8c' }}>{i + 1}</span> 
    },
    { 
      title: 'Tên môn học', 
      dataIndex: 'ten', 
      key: 'ten', 
      ellipsis: true,
      render: (text: string) => <strong style={{ color: '#262626' }}>{text}</strong>
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'moTa', 
      key: 'moTa', 
      ellipsis: true,
      render: (text: string) => <span style={{ color: '#595959' }}>{text || '—'}</span>
    },
    {
      title: 'Khối kiến thức liên kết',
      key: 'kkt',
      render: (_: any, r: MonHoc) =>
        r.khoiKienThucIds.length === 0 ? (
          <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Chưa gán</span>
        ) : (
          <Space wrap size={[0, 8]}>
            {r.khoiKienThucIds.map((id) => (
              <Tag key={id} color="cyan" style={{ borderRadius: 4, border: '1px solid #87e8de' }}>
                {kktMap.get(id) || id}
              </Tag>
            ))}
          </Space>
        ),
    },
    {
      title: 'Số câu hỏi',
      key: 'count',
      width: 120,
      render: (_: any, r: MonHoc) => {
        const count = cauHois.filter((c) => c.monHocId === r.id).length;
        return <Tag color={count > 0 ? 'geekblue' : 'default'} style={{ borderRadius: 12, padding: '0 10px' }}>{count} câu</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: MonHoc) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" style={{ color: '#1890ff' }} icon={<EditOutlined />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc chắn muốn xóa môn học này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy" placement="topRight">
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<><BookOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Môn học ({monHocs.length})</>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 6, background: '#52c41a', borderColor: '#52c41a' }}>
            Thêm môn học
          </Button>
        }
        bordered={false}
      >
        <Table
          dataSource={monHocs}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có môn học nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        />
      </Card>

      <Modal
        title={<div style={{ fontWeight: 600, fontSize: 16 }}>{editing ? 'Sửa môn học' : 'Thêm môn học mới'}</div>}
        visible={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Lưu thông tin"
        cancelText="Hủy bỏ"
        centered
        width={550}
        wrapClassName="exam-admin-modal"
        okButtonProps={{ style: { borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
            <Input placeholder="VD: Toán cao cấp, Vật lý đại cương..." size="large" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả chi tiết">
            <TextArea rows={2} placeholder="Nhập mô tả ngắn gọn..." />
          </Form.Item>
          <Form.Item name="khoiKienThucIds" label="Khối kiến thức liên kết" extra="Bạn có thể chọn nhiều khối kiến thức thuộc môn học này">
            <Select 
              mode="multiple" 
              placeholder="Chọn khối kiến thức..." 
              allowClear
              size="large"
              style={{ width: '100%' }}
              options={khoiKienThucs.map(k => ({ label: k.ten, value: k.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};


const DanhMucTab: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <KhoiKienThucManager />
    <MonHocManager />
  </div>
);

export default DanhMucTab;
