import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Avatar, Tooltip, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { MOCK_SERVICES, MOCK_EMPLOYEES, formatDate } from '../types';
import type { Appointment, AppointmentStatus } from '../types';

const { Text } = Typography;

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'orange', confirmed: 'blue', completed: 'green', cancelled: 'red',
};
export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Chờ duyệt', confirmed: 'Xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy',
};

interface Props {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (a: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentTable: React.FC<Props> = ({ appointments, onStatusChange, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Khách hàng', key: 'customer',
      render: (_: unknown, a: Appointment) => (
        <Space>
          <Avatar size={32} style={{ background: '#6c63ff', fontSize: 13 }}>{a.customerName[0]}</Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{a.customerName}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{a.customerPhone}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Dịch vụ', dataIndex: 'serviceId', key: 'service',
      render: (id: string) => {
        const s = MOCK_SERVICES.find(x => x.id === id);
        return <Tag color={s?.color}>{s?.name ?? id}</Tag>;
      },
    },
    {
      title: 'Nhân viên', dataIndex: 'employeeId', key: 'employee',
      render: (id: string) => {
        const e = MOCK_EMPLOYEES.find(x => x.id === id);
        return <Space><Avatar src={e?.avatar} size={24} /><Text style={{ fontSize: 13 }}>{e?.name ?? id}</Text></Space>;
      },
    },
    {
      title: 'Ngày & Giờ', key: 'dt',
      render: (_: unknown, a: Appointment) => (
        <div>
          <Text style={{ display: 'block', fontSize: 13 }}>{formatDate(a.date)}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{a.startTime} – {a.endTime}</Text>
        </div>
      ),
      sorter: (a: Appointment, b: Appointment) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (s: AppointmentStatus) => <Tag color={STATUS_COLORS[s]}>{STATUS_LABELS[s]}</Tag>,
      filters: Object.entries(STATUS_LABELS).map(([k, v]) => ({ text: v, value: k })),
      onFilter: (v: unknown, r: Appointment) => r.status === v,
    },
    {
      title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true,
      render: (n: string) => n
        ? <Tooltip title={n}><Text type="secondary" style={{ fontSize: 12 }}>{n}</Text></Tooltip>
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Hành động', key: 'action', width: 180,
      render: (_: unknown, a: Appointment) => (
        <Space size={4} wrap>
          {a.status === 'pending' && (
            <Tooltip title="Xác nhận">
              <Button size="small" type="primary" icon={<CheckOutlined />}
                onClick={() => onStatusChange(a.id, 'confirmed')} />
            </Tooltip>
          )}
          {a.status === 'confirmed' && (
            <Tooltip title="Hoàn thành">
              <Button size="small" icon={<CheckCircleOutlined />}
                style={{ color: '#10b981', borderColor: '#10b981' }}
                onClick={() => onStatusChange(a.id, 'completed')} />
            </Tooltip>
          )}
          {(a.status === 'pending' || a.status === 'confirmed') && (
            <Tooltip title="Sửa">
              <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(a)} />
            </Tooltip>
          )}
          {a.status !== 'cancelled' && a.status !== 'completed' && (
            <Popconfirm title="Hủy lịch hẹn?" onConfirm={() => onStatusChange(a.id, 'cancelled')}
              okText="Hủy lịch" cancelText="Không" okButtonProps={{ danger: true }}>
              <Tooltip title="Hủy"><Button size="small" icon={<CloseOutlined />} danger /></Tooltip>
            </Popconfirm>
          )}
          <Popconfirm title="Xóa lịch hẹn?" onConfirm={() => onDelete(a.id)}
            okText="Xóa" cancelText="Không" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa"><Button size="small" icon={<DeleteOutlined />} danger ghost /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={appointments} columns={columns} rowKey="id" size="middle"
      pagination={{ pageSize: 8, showTotal: t => `Tổng ${t} lịch hẹn` }}
      scroll={{ x: 900 }}
      locale={{ emptyText: 'Không có lịch hẹn nào' }}
    />
  );
};

export default AppointmentTable;