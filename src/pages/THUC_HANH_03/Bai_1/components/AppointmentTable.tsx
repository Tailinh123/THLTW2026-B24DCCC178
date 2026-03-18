
import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Avatar, Tooltip, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { MOCK_SERVICES, formatDate } from '../types';
import type { Appointment, AppointmentStatus, Employee } from '../types';

const { Text } = Typography;

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: '#f59e0b', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444',
};
export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Chờ duyệt', confirmed: 'Xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy',
};

interface Props {
  appointments: Appointment[];
  employees: Employee[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (a: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentTable: React.FC<Props> = ({ appointments, employees, onStatusChange, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Khách hàng', key: 'customer',
      render: (_: unknown, a: Appointment) => (
        <Space>
          <Avatar size={36} style={{ background: '#6366f1', fontSize: 14, fontWeight: 700 }}>{a.customerName[0]}</Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{a.customerName}</Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>{a.customerPhone}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Dịch vụ', dataIndex: 'serviceId', key: 'service',
      render: (id: string) => {
        const s = MOCK_SERVICES.find(x => x.id === id);
        return <Tag color={s?.color} className="bb-tag">{s?.name ?? id}</Tag>;
      },
    },
    {
      title: 'Nhân viên', dataIndex: 'employeeId', key: 'employee',
      render: (id: string) => {
        const e = employees.find(x => x.id === id);
        return <Space><Avatar src={e?.avatar} size={28} /><Text style={{ fontSize: 13, fontWeight: 500 }}>{e?.name ?? id}</Text></Space>;
      },
    },
    {
      title: 'Ngày & Giờ', key: 'dt',
      render: (_: unknown, a: Appointment) => (
        <div>
          <Text style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{formatDate(a.date)}</Text>
          <Text style={{ fontSize: 13, color: '#64748b' }}>{a.startTime} – {a.endTime}</Text>
        </div>
      ),
      sorter: (a: Appointment, b: Appointment) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (s: AppointmentStatus) => (
        <Tag
          style={{
            borderRadius: 20, fontWeight: 600, fontSize: 12,
            padding: '2px 12px', border: 'none',
            background: `${STATUS_COLORS[s]}15`,
            color: STATUS_COLORS[s],
          }}
        >
          {STATUS_LABELS[s]}
        </Tag>
      ),
      filters: Object.entries(STATUS_LABELS).map(([k, v]) => ({ text: v, value: k })),
      onFilter: (v: unknown, r: Appointment) => r.status === v,
    },
    {
      title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true,
      render: (n: string) => n
        ? <Tooltip title={n}><Text style={{ fontSize: 13, color: '#64748b' }}>{n}</Text></Tooltip>
        : <Text style={{ color: '#cbd5e1' }}>—</Text>,
    },
    {
      title: 'Hành động', key: 'action', width: 180,
      render: (_: unknown, a: Appointment) => (
        <Space size={4} wrap>
          {a.status === 'pending' && (
            <Tooltip title="Xác nhận">
              <Button size="small" type="primary"
                style={{ borderRadius: 8, background: '#6366f1', border: 'none' }}
                icon={<CheckOutlined />}
                onClick={() => onStatusChange(a.id, 'confirmed')} />
            </Tooltip>
          )}
          {a.status === 'confirmed' && (
            <Tooltip title="Hoàn thành">
              <Button size="small" icon={<CheckCircleOutlined />}
                style={{ color: '#10b981', borderColor: '#10b981', borderRadius: 8 }}
                onClick={() => onStatusChange(a.id, 'completed')} />
            </Tooltip>
          )}
          {(a.status === 'pending' || a.status === 'confirmed') && (
            <Tooltip title="Sửa">
              <Button size="small" icon={<EditOutlined />} style={{ borderRadius: 8 }} onClick={() => onEdit(a)} />
            </Tooltip>
          )}
          {a.status !== 'cancelled' && a.status !== 'completed' && (
            <Popconfirm title="Hủy lịch hẹn?" onConfirm={() => onStatusChange(a.id, 'cancelled')}
              okText="Hủy lịch" cancelText="Không" okButtonProps={{ danger: true }}>
              <Tooltip title="Hủy"><Button size="small" icon={<CloseOutlined />} danger style={{ borderRadius: 8 }} /></Tooltip>
            </Popconfirm>
          )}
          <Popconfirm title="Xóa lịch hẹn?" onConfirm={() => onDelete(a.id)}
            okText="Xóa" cancelText="Không" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa"><Button size="small" icon={<DeleteOutlined />} danger ghost style={{ borderRadius: 8 }} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bb-table">
      <Table
        dataSource={appointments} columns={columns} rowKey="id" size="middle"
        pagination={{ pageSize: 8, showTotal: t => `Tổng ${t} lịch hẹn` }}
        scroll={{ x: 900 }}
        locale={{ emptyText: 'Không có lịch hẹn nào' }}
      />
    </div>
  );
};

export default AppointmentTable;