import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Tag, Button, Tooltip, Space, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { Task, Status, Priority } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, isOverdue } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface TableViewTabProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TableViewTab: React.FC<TableViewTabProps> = ({ tasks, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const columns: ColumnsType<Task> = [
    {
      title: 'Tên Task',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string, record: Task) => {
        const overdue = isOverdue(record.deadline, record.status);
        return (
          <div>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{text}</span>
            {overdue && (
              <Tag color="error" style={{ marginLeft: 8, fontSize: 10, borderRadius: 4 }}>
                Quá hạn
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '22%',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#64748b', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: Status) => (
        <Tag
          color={STATUS_CONFIG[status].color}
          style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}
        >
          {STATUS_CONFIG[status].icon} {STATUS_CONFIG[status].label}
        </Tag>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: '10%',
      render: (priority: Priority) => (
        <Tag
          color={PRIORITY_CONFIG[priority].color}
          style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}
        >
          {PRIORITY_CONFIG[priority].label}
        </Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '15%',
      render: (tags: string[]) => (
        <div>
          {tags.map((tag) => (
            <Tag key={tag} style={{ borderRadius: 4, fontSize: 11, marginBottom: 2 }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      width: '10%',
      sorter: (a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      render: (deadline: string, record: Task) => {
        const overdue = isOverdue(deadline, record.status);
        return (
          <span style={{ color: overdue ? '#ef4444' : '#475569', fontSize: 13 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {moment(deadline).format('DD/MM/YYYY')}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '8%',
      align: 'center' as const,
      render: (_: unknown, record: Task) => (
        <Space size={12}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#6366f1' }} />}
              onClick={() => onEdit(record)}
              className="kanban-action-btn"
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa task này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                className="kanban-action-btn"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="kanban-table-view">
      <div className="kanban-filters">
        <Input
          placeholder="Tìm kiếm task..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="kanban-filter-input"
        />
        <Select
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="kanban-filter-select"
          dropdownMatchSelectWidth={false}
        >
          <Option value="ALL">Tất cả trạng thái</Option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <Option key={key} value={key}>{cfg.icon} {cfg.label}</Option>
          ))}
        </Select>
        <Select
          value={priorityFilter}
          onChange={(val) => setPriorityFilter(val)}
          className="kanban-filter-select"
          dropdownMatchSelectWidth={false}
        >
          <Option value="ALL">Tất cả ưu tiên</Option>
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <Option key={key} value={key}>{cfg.label}</Option>
          ))}
        </Select>
      </div>

      <Table<Task>
        dataSource={filteredTasks}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} task`,
        }}
        className="kanban-table"
        rowClassName={(record) => isOverdue(record.deadline, record.status) ? 'kanban-row-overdue' : ''}
      />
    </div>
  );
};

export default TableViewTab;
