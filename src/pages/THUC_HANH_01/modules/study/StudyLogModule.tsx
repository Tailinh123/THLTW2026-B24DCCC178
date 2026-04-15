import React, { useState, useMemo } from 'react';
import { Card, Space, Button, Table, Tag, Tooltip, Popconfirm, Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Typography, notification } from 'antd';
import { CalendarOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useStudy } from '../../hooks/useStudy';
import dayjs from 'dayjs';

const { Text } = Typography;
const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const fmtMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}p`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}p`;
};

export default function StudyLogModule() {
  const study = useStudy();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterMonth, setFilterMonth] = useState(dayjs().format("YYYY-MM"));

  const openAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ startTime: dayjs(), duration: 30 }); setOpen(true); };
  const openEdit = (log: any) => {
    setEditing(log);
    form.setFieldsValue({ ...log, startTime: dayjs(log.startTime) });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const vals = await form.validateFields();
      const payload = {
        ...vals,
        startTime: vals.startTime.toISOString(),
        createdAt: new Date().toISOString(),
      };
      if (editing) {
        study.updateLog({ ...editing, ...payload });
        notification.success({ message: "Đã cập nhật lịch học!" });
      } else {
        study.addLog({ id: uid(), ...payload });
        notification.success({ message: "Đã thêm lịch học mới!" });
      }
      setOpen(false);
    } catch {}
  };

  const monthLogs = useMemo(() =>
    study.logs
      .filter(l => dayjs(l.startTime).format("YYYY-MM") === filterMonth)
      .sort((a, b) => dayjs(b.startTime).unix() - dayjs(a.startTime).unix()),
    [study.logs, filterMonth]);

  const getCat = (id: string) => study.categories.find(c => c.id === id);

  const columns = [
    {
      title: "Môn học", dataIndex: "categoryId", width: 140,
      render: (id: string) => {
        const cat = getCat(id);
        return cat ? <Tag color={cat.color} style={{ fontWeight: 600 }}>{cat.icon} {cat.name}</Tag> : <Tag>?</Tag>;
      }
    },
    {
      title: "Thời gian", dataIndex: "startTime", width: 160,
      render: (t: string) => <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(t).format("DD/MM/YYYY HH:mm")}</Text>
    },
    {
      title: "Thời lượng", dataIndex: "duration", width: 110,
      render: (d: number) => <Tag icon={<ClockCircleOutlined />} color="processing">{fmtMinutes(d)}</Tag>
    },
    { title: "Nội dung", dataIndex: "content", ellipsis: true },
    { title: "Ghi chú", dataIndex: "note", ellipsis: true, render: (n: string) => n || <Text type="secondary">—</Text> },
    {
      title: "Thao tác", key: "actions", width: 100,
      render: (_: any, row: any) => (
        <Space>
          <Tooltip title="Sửa"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} /></Tooltip>
          <Popconfirm title="Xóa buổi học này?" onConfirm={() => { study.deleteLog(row.id); notification.success({ message: "Đã xóa!" }); }} okText="Xóa" cancelText="Hủy">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <>
      <Card
        title={<Space><CalendarOutlined /><span>Lịch học</span></Space>}
        extra={
          <Space>
            <DatePicker
              picker="month"
              value={dayjs(filterMonth)}
              onChange={d => setFilterMonth(d ? d.format("YYYY-MM") : dayjs().format("YYYY-MM"))}
              format="MM/YYYY"
              allowClear={false}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm buổi học</Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary">
            Tháng {dayjs(filterMonth).format("MM/YYYY")} — {monthLogs.length} buổi —{" "}
            <Text strong>{fmtMinutes(monthLogs.reduce((s, l) => s + l.duration, 0))}</Text> tổng
          </Text>
        </div>
        <Table
          dataSource={monthLogs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có buổi học nào trong tháng này" /> }}
          scroll={{ x: 700 }}
        />
      </Card>

      <Modal
        title={editing ? "Sửa buổi học" : "Thêm buổi học mới"}
        visible={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="categoryId" label="Môn học"
            rules={[{ required: true, message: "Chọn môn học!" }]}>
            <Select placeholder="Chọn môn học">
              {study.categories.map(c => (
                <Select.Option key={c.id} value={c.id}>
                  <Space>{c.icon} {c.name}</Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item name="startTime" label="Thời gian bắt đầu"
                rules={[{ required: true, message: "Chọn thời gian!" }]}>
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="duration" label="Thời lượng (phút)"
                rules={[
                  { required: true, message: "Nhập thời lượng!" },
                  { type: "number", min: 1, max: 480, message: "Từ 1–480 phút!" },
                ]}>
                <InputNumber min={1} max={480} style={{ width: "100%" }} addonAfter="phút" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="content" label="Nội dung học"
            rules={[
              { required: true, message: "Nhập nội dung học!" },
              { min: 3, message: "Tối thiểu 3 ký tự!" },
              { max: 200, message: "Tối đa 200 ký tự!" },
            ]}>
            <Input.TextArea rows={3} placeholder="VD: Ôn tập chương 3, giải phương trình..." maxLength={200} showCount />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú (tuỳ chọn)"
            rules={[{ max: 300, message: "Tối đa 300 ký tự!" }]}>
            <Input.TextArea rows={2} placeholder="Ghi chú thêm..." maxLength={300} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
