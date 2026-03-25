import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Input, Space, Typography, Alert, Tag, Avatar } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  MOCK_SERVICES, MOCK_EMPLOYEES,
  calcEndTime, generateTimeSlots, hasConflict,
} from '../types';
import type { Appointment } from '../types';

const { Text } = Typography;

interface Props {
  appointments: Appointment[];
  onSuccess: (data: Omit<Appointment, 'id' | 'createdAt'>) => void;
  initialValues?: Appointment;
  submitLabel?: string;
}

const AppointmentForm: React.FC<Props> = ({
  appointments, onSuccess, initialValues, submitLabel = 'Đặt lịch',
}) => {
  const [form] = Form.useForm();
  const [svcId, setSvcId] = useState<string | undefined>(initialValues?.serviceId);
  const [date, setDate] = useState<Dayjs | null>(initialValues?.date ? dayjs(initialValues.date) : null);
  const [empId, setEmpId] = useState<string | undefined>(initialValues?.employeeId);
  const [slots, setSlots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const svc = MOCK_SERVICES.find(s => s.id === svcId);

  
  const eligibleEmps = MOCK_EMPLOYEES.filter(e =>
    (!svcId || e.serviceIds.includes(svcId)) &&
    (!date || e.schedule.some(s => s.day === date.day()))
  );

  
  useEffect(() => {
    if (!date || !empId || !svc) { setSlots([]); return; }
    const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
    const shift = emp?.schedule.find(s => s.day === date.day());
    if (!shift) { setSlots([]); return; }
    const ds = date.format('YYYY-MM-DD');
    const all = generateTimeSlots(shift.startTime, shift.endTime, svc.durationMinutes);
    setSlots(all.filter(s => !hasConflict(appointments, empId, ds, s, svc.durationMinutes, initialValues?.id)));
  }, [date, empId, svc, appointments, initialValues?.id]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const service = MOCK_SERVICES.find(s => s.id === values.serviceId)!;
      const emp = MOCK_EMPLOYEES.find(e => e.id === values.employeeId)!;
      const ds = (values.date as Dayjs).format('YYYY-MM-DD');

      
      const daily = appointments.filter(a =>
        a.employeeId === values.employeeId && a.date === ds &&
        a.status !== 'cancelled' && a.id !== initialValues?.id
      ).length;
      if (daily >= emp.maxClientsPerDay) {
        setError(`Nhân viên đã đủ ${emp.maxClientsPerDay} khách hôm nay!`); return;
      }
      if (hasConflict(appointments, values.employeeId, ds, values.startTime, service.durationMinutes, initialValues?.id)) {
        setError('Khung giờ này đã có lịch hẹn khác!'); return;
      }

      setError(null);
      onSuccess({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        serviceId: values.serviceId,
        employeeId: values.employeeId,
        date: ds,
        startTime: values.startTime,
        endTime: calcEndTime(values.startTime, service.durationMinutes),
        status: initialValues?.status ?? 'pending',
        notes: values.notes ?? '',
      });
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ? { ...initialValues, date: dayjs(initialValues.date) } : undefined}
    >
      {error && (
        <Alert type="error" message={error} showIcon closable
          onClose={() => setError(null)} style={{ marginBottom: 16 }} />
      )}

      <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
        <Select
          placeholder="Chọn dịch vụ"
          onChange={v => { setSvcId(v); setEmpId(undefined); form.setFieldsValue({ employeeId: undefined, startTime: undefined }); }}
          options={MOCK_SERVICES.filter(s => s.isActive).map(s => ({
            value: s.id,
            label: <Space><Tag color={s.color} style={{ margin: 0 }}>{s.name}</Tag><Text type="secondary" style={{ fontSize: 12 }}>{s.durationMinutes}p · {(s.price/1000).toFixed(0)}k</Text></Space>,
          }))}
        />
      </Form.Item>

      <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true, message: 'Chọn ngày' }]}>
        <DatePicker
          style={{ width: '100%' }} format="DD/MM/YYYY"
          disabledDate={c => c && c < dayjs().startOf('day')}
          onChange={d => { setDate(d); setEmpId(undefined); form.setFieldsValue({ employeeId: undefined, startTime: undefined }); }}
        />
      </Form.Item>

      <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
        <Select
          disabled={!svcId || !date}
          placeholder={!svcId ? 'Chọn dịch vụ trước' : !date ? 'Chọn ngày trước' : 'Chọn nhân viên'}
          onChange={v => { setEmpId(v); form.setFieldValue('startTime', undefined); }}
          options={eligibleEmps.map(e => ({
            value: e.id,
            label: <Space><Avatar src={e.avatar} size={20} /><span>{e.name}</span><Text type="secondary" style={{ fontSize: 11 }}>({e.specialization})</Text></Space>,
          }))}
          notFoundContent={<Text type="secondary">Không có nhân viên phù hợp</Text>}
        />
      </Form.Item>

      <Form.Item name="startTime" label="Khung giờ" rules={[{ required: true, message: 'Chọn giờ' }]}>
        <Select
          disabled={!empId}
          placeholder={!empId ? 'Chọn nhân viên trước' : slots.length === 0 ? 'Hết giờ trống' : 'Chọn giờ'}
          options={slots.map(s => ({
            value: s,
            label: <Space><Text>{s}</Text>{svc && <Text type="secondary" style={{ fontSize: 11 }}>→ {calcEndTime(s, svc.durationMinutes)}</Text>}</Space>,
          }))}
        />
      </Form.Item>

      <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Nhập tên' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="notes" label="Ghi chú">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Button type="primary" block size="large" onClick={handleSubmit}>
        {submitLabel}
      </Button>
    </Form>
  );
};

export default AppointmentForm;