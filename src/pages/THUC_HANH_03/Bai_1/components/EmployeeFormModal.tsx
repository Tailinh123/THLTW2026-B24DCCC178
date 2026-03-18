/* ============================================================
 * EmployeeFormModal — Modal thêm/sửa nhân viên (có upload ảnh)
 * ============================================================ */
import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, Select, InputNumber,
  Upload, Avatar, Typography, Space, TimePicker, Button, Tag,
} from 'antd';
import { PlusOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Employee, DayOfWeek, WorkShift } from '../types';
import { MOCK_SERVICES, DAY_NAMES } from '../types';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  open: boolean;
  editing: Employee | null;
  onCancel: () => void;
  onSave: (data: Omit<Employee, 'id'>) => void;
}

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

const EmployeeFormModal: React.FC<Props> = ({ open, editing, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [schedule, setSchedule] = useState<WorkShift[]>([]);

  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({
          name: editing.name,
          specialization: editing.specialization,
          phone: editing.phone,
          bio: editing.bio,
          maxClientsPerDay: editing.maxClientsPerDay,
          serviceIds: editing.serviceIds,
        });
        setAvatarUrl(editing.avatar);
        setSchedule(editing.schedule);
      } else {
        form.resetFields();
        setAvatarUrl('');
        setSchedule([
          { day: 1, startTime: '08:00', endTime: '17:00' },
          { day: 2, startTime: '08:00', endTime: '17:00' },
          { day: 3, startTime: '08:00', endTime: '17:00' },
          { day: 4, startTime: '08:00', endTime: '17:00' },
          { day: 5, startTime: '08:00', endTime: '17:00' },
        ]);
      }
    }
  }, [open, editing, form]);

  /* Xử lý upload ảnh — convert sang base64 để hiển thị */
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  /* Thêm ngày làm việc */
  const addScheduleDay = (day: DayOfWeek) => {
    if (schedule.some(s => s.day === day)) return;
    setSchedule(prev => [...prev, { day, startTime: '08:00', endTime: '17:00' }].sort((a, b) => a.day - b.day));
  };

  /* Xóa ngày làm việc */
  const removeScheduleDay = (day: DayOfWeek) => {
    setSchedule(prev => prev.filter(s => s.day !== day));
  };

  /* Cập nhật giờ */
  const updateScheduleTime = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map(s => s.day === day ? { ...s, [field]: value } : s));
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const avatar = avatarUrl || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`;
      onSave({
        name: values.name,
        avatar,
        specialization: values.specialization,
        phone: values.phone,
        bio: values.bio || '',
        maxClientsPerDay: values.maxClientsPerDay,
        serviceIds: values.serviceIds || [],
        schedule,
      });
    });
  };

  const unusedDays = ALL_DAYS.filter(d => !schedule.some(s => s.day === d));

  return (
    <Modal
      title={editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
      visible={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={editing ? 'Cập nhật' : 'Thêm nhân viên'}
      cancelText="Hủy"
      width={600}
      destroyOnClose
      centered
      wrapClassName="bb-modal"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Avatar upload */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            accept="image/*"
          >
            <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
              <Avatar
                size={100}
                src={avatarUrl || undefined}
                style={{
                  border: '3px solid #eef2ff',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)',
                  background: '#eef2ff',
                  color: '#6366f1',
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {!avatarUrl && <CameraOutlined />}
              </Avatar>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 32, height: 32, borderRadius: '50%',
                background: '#6366f1', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff', color: '#fff', fontSize: 14,
              }}>
                <CameraOutlined />
              </div>
            </div>
          </Upload>
          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 13, color: '#64748b' }}>Nhấn để tải ảnh chân dung</Text>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên nhân viên' }]}>
          <Input placeholder="VD: Nguyễn Thị Lan" size="large" />
        </Form.Item>

        <Form.Item name="specialization" label="Chuyên môn" rules={[{ required: true, message: 'Nhập chuyên môn' }]}>
          <Input placeholder="VD: Chuyên gia tóc, Kỹ thuật viên nail..." size="large" />
        </Form.Item>

        <Space style={{ width: '100%' }} size={16}>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]} style={{ flex: 1 }}>
            <Input placeholder="0901234567" size="large" />
          </Form.Item>
          <Form.Item name="maxClientsPerDay" label="Khách tối đa/ngày" rules={[{ required: true }]} style={{ flex: 1 }} initialValue={8}>
            <InputNumber min={1} max={20} size="large" style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item name="serviceIds" label="Dịch vụ đảm nhận">
          <Select
            mode="multiple" placeholder="Chọn dịch vụ..."
            options={MOCK_SERVICES.map(s => ({ label: s.name, value: s.id }))}
            size="large"
          />
        </Form.Item>

        <Form.Item name="bio" label="Giới thiệu ngắn">
          <TextArea rows={2} placeholder="Mô tả kinh nghiệm, sở trường..." />
        </Form.Item>

        {/* Lịch làm việc */}
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>Lịch làm việc</Text>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {schedule.map(s => (
              <div key={s.day} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 14px', background: '#f8fafc', borderRadius: 10,
                border: '1px solid #e2e8f0',
              }}>
                <Tag color="blue" style={{ borderRadius: 8, fontWeight: 600, minWidth: 72, textAlign: 'center' }}>
                  {DAY_NAMES[s.day as DayOfWeek]}
                </Tag>
                <TimePicker
                  value={dayjs(s.startTime, 'HH:mm')} format="HH:mm"
                  onChange={(_, str) => updateScheduleTime(s.day as DayOfWeek, 'startTime', str as string)}
                  size="small" style={{ width: 90 }}
                />
                <Text style={{ color: '#94a3b8' }}>đến</Text>
                <TimePicker
                  value={dayjs(s.endTime, 'HH:mm')} format="HH:mm"
                  onChange={(_, str) => updateScheduleTime(s.day as DayOfWeek, 'endTime', str as string)}
                  size="small" style={{ width: 90 }}
                />
                <Button type="text" danger size="small" icon={<DeleteOutlined />}
                  onClick={() => removeScheduleDay(s.day as DayOfWeek)} />
              </div>
            ))}
          </Space>

          {unusedDays.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <Select
                placeholder="+ Thêm ngày làm việc"
                style={{ width: 200 }}
                size="small"
                value={undefined}
                onChange={(v) => addScheduleDay(v as DayOfWeek)}
                options={unusedDays.map(d => ({ label: DAY_NAMES[d], value: d }))}
              />
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EmployeeFormModal;
