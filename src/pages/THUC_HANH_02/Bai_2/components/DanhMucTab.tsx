/* ============================================================
 * THUC_HANH_01 — Bài 2: Tab Danh Mục
 * CRUD for Khối Kiến Thức + Môn Học (N-N relationship)
 * ============================================================ */
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
  Row,
  Col,
  message,
  Empty,
  Divider,
  Typography,
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
const { Title } = Typography;

/* =============================================================
 * 1. KHỐI KIẾN THỨC MANAGER
 * ============================================================= */
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
        message.success('Đã cập nhật');
      } else {
        dispatch(dmActions.addKKT(vals));
        message.success('Đã thêm');
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
    message.success('Đã xóa');
  };

  const columns = [
    { title: '#', key: 'stt', width: 50, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên khối kiến thức', dataIndex: 'ten', key: 'ten', ellipsis: true },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    {
      title: 'Số câu hỏi',
      key: 'count',
      width: 100,
      render: (_: any, r: KhoiKienThuc) => {
        const count = cauHois.filter((c) => c.khoiKienThucId === r.id).length;
        return <Tag color="blue">{count}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, r: KhoiKienThuc) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Xóa khối kiến thức này?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<><AppstoreOutlined /> Khối kiến thức ({khoiKienThucs.length})</>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm mới
          </Button>
        }
        size="small"
      >
        <Table
          dataSource={khoiKienThucs}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5, size: 'small' }}
          locale={{ emptyText: <Empty description="Chưa có khối kiến thức nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        />
      </Card>

      <Modal
        title={editing ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
        visible={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input placeholder="VD: Đại số, Hình học..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả ngắn..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

/* =============================================================
 * 2. MÔN HỌC MANAGER
 * ============================================================= */
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
        message.success('Đã cập nhật');
      } else {
        dispatch(dmActions.addMonHoc({ ...vals, khoiKienThucIds: vals.khoiKienThucIds || [] }));
        message.success('Đã thêm');
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
    message.success('Đã xóa');
  };

  const kktMap = new Map(khoiKienThucs.map((k) => [k.id, k.ten]));

  const columns = [
    { title: '#', key: 'stt', width: 50, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên môn học', dataIndex: 'ten', key: 'ten', ellipsis: true },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    {
      title: 'Khối kiến thức',
      key: 'kkt',
      render: (_: any, r: MonHoc) =>
        r.khoiKienThucIds.length === 0 ? (
          <Tag>Chưa gán</Tag>
        ) : (
          <Space wrap>
            {r.khoiKienThucIds.map((id) => (
              <Tag key={id} color="geekblue">{kktMap.get(id) || id}</Tag>
            ))}
          </Space>
        ),
    },
    {
      title: 'Số câu hỏi',
      key: 'count',
      width: 100,
      render: (_: any, r: MonHoc) => {
        const count = cauHois.filter((c) => c.monHocId === r.id).length;
        return <Tag color="blue">{count}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, r: MonHoc) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Xóa môn học này?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<><BookOutlined /> Môn học ({monHocs.length})</>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm mới
          </Button>
        }
        size="small"
      >
        <Table
          dataSource={monHocs}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5, size: 'small' }}
          locale={{ emptyText: <Empty description="Chưa có môn học nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        />
      </Card>

      <Modal
        title={editing ? 'Sửa môn học' : 'Thêm môn học'}
        visible={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input placeholder="VD: Toán cao cấp, Vật lý đại cương..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả ngắn..." />
          </Form.Item>
          <Form.Item name="khoiKienThucIds" label="Khối kiến thức liên kết">
            <Select mode="multiple" placeholder="Chọn khối kiến thức..." allowClear>
              {khoiKienThucs.map((k) => (
                <Select.Option key={k.id} value={k.id}>{k.ten}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

/* =============================================================
 * MAIN EXPORT — Tab Danh Mục gồm cả 2 manager
 * ============================================================= */
const DanhMucTab: React.FC = () => (
  <div>
    <KhoiKienThucManager />
    <Divider />
    <MonHocManager />
  </div>
);

export default DanhMucTab;
