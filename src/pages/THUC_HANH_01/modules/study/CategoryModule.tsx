import React, { useState } from 'react';
import { Card, Space, Button, Empty, Table, Tag, Tooltip, Popconfirm, Modal, Form, Input, Select, Avatar, notification } from 'antd';
import { FolderOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStudy } from '../../hooks/useStudy';

const { Text } = Typography;
import { Typography } from 'antd';

const ICON_OPTIONS = ["📐","✍️","🌐","⚡","🧪","📚","🎨","🔬","🏛️","💻","🎵","🌍","📊","🔭","⚗️"];
const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function CategoryModule() {
  const study = useStudy();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const openAdd = () => { 
    setEditing(null); 
    form.resetFields(); 
    form.setFieldsValue({ color: "#1677ff", icon: "📚" }); 
    setOpen(true); 
  };
  
  const openEdit = (cat: any) => { 
    setEditing(cat); 
    form.setFieldsValue({ ...cat }); 
    setOpen(true); 
  };

  const handleSubmit = async () => {
    try {
      const vals = await form.validateFields();
      const color = vals.color || "#1677ff";
      
      if (editing) {
        // check duplicate name
        const dup = study.categories.find(c => c.name.toLowerCase() === vals.name.toLowerCase() && c.id !== editing.id);
        if (dup) { notification.error({ message: "Tên môn học đã tồn tại!" }); return; }
        study.updateCategory({ ...editing, ...vals, color });
        notification.success({ message: "Đã cập nhật danh mục!" });
      } else {
        const dup = study.categories.find(c => c.name.toLowerCase() === vals.name.toLowerCase());
        if (dup) { notification.error({ message: "Tên môn học đã tồn tại!" }); return; }
        study.addCategory({ id: uid(), ...vals, color });
        notification.success({ message: "Đã thêm danh mục mới!" });
      }
      setOpen(false);
    } catch {}
  };

  const handleDelete = (cat: any) => {
    const usedInLog = study.logs.some(l => l.categoryId === cat.id);
    if (usedInLog) {
      notification.warning({ message: "Không thể xóa!", description: "Danh mục này đang được dùng trong lịch học." });
      return;
    }
    study.deleteCategory(cat.id);
    notification.success({ message: "Đã xóa danh mục!" });
  };

  const columns = [
    {
      title: "Môn học", dataIndex: "name",
      render: (name: string, row: any) => (
        <Space>
          <Avatar style={{ backgroundColor: row.color, fontSize: 16 }}>{row.icon}</Avatar>
          <Text strong>{name}</Text>
        </Space>
      )
    },
    { title: "Màu sắc", dataIndex: "color", render: (c: string) => <Tag color={c} style={{ border: `2px solid ${c}` }}>{c}</Tag> },
    {
      title: "Thao tác", key: "actions", width: 120,
      render: (_: any, row: any) => (
        <Space>
          <Tooltip title="Sửa"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} /></Tooltip>
          <Popconfirm title="Xóa danh mục này?" onConfirm={() => handleDelete(row)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <>
      <Card
        title={<Space><FolderOutlined /><span>Quản lý Danh mục Môn học</span></Space>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm môn</Button>}
      >
        <Table
          dataSource={study.categories}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: <Empty description="Chưa có danh mục nào" /> }}
        />
      </Card>

      <Modal
        title={editing ? "Sửa danh mục" : "Thêm danh mục mới"}
        visible={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Tên môn học"
            rules={[
              { required: true, message: "Vui lòng nhập tên môn học!" },
              { min: 1, max: 30, message: "Tên từ 1–30 ký tự!" },
              { pattern: /S/, message: "Không được chỉ có khoảng trắng!" },
            ]}>
            <Input placeholder="VD: Toán, Văn, Anh..." maxLength={30} showCount />
          </Form.Item>
          <Form.Item name="icon" label="Biểu tượng"
            rules={[{ required: true, message: "Chọn biểu tượng!" }]}>
            <Select placeholder="Chọn icon">
              {ICON_OPTIONS.map(ic => (
                <Select.Option key={ic} value={ic}><span style={{ fontSize: 18 }}>{ic}</span></Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="color" label="Màu sắc nhận diện"
            rules={[{ required: true, message: "Chọn màu!" }]}>
            <Input type="color" style={{ width: '80px', padding: '0 4px' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
