import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Space, Modal, Form, Input, InputNumber, Select,
  DatePicker, Radio, Popconfirm, Tag, Typography, Row, Col, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  CalendarOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { WorkoutEntry, WorkoutType, WorkoutStatus } from '../types';
import { WORKOUT_TYPE_COLORS } from '../types';
import { WorkoutStatusTag } from '../components/StatusTag';
import { formatDate, formatDuration } from '../utils/formatters';
import { genId } from '../mockData';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const WORKOUT_TYPES: WorkoutType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];

const WORKOUT_TYPE_EMOJI: Record<WorkoutType, string> = {
  Cardio: '🏃',
  Strength: '🏋️',
  Yoga: '🧘',
  HIIT: '⚡',
  Other: '⚽',
};

interface WorkoutLogProps {
  workouts: WorkoutEntry[];
  onAdd: (entry: WorkoutEntry) => void;
  onEdit: (id: string, entry: Partial<WorkoutEntry>) => void;
  onDelete: (id: string) => void;
}

const WorkoutLog: React.FC<WorkoutLogProps> = ({ workouts, onAdd, onEdit, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkoutEntry | null>(null);
  const [form] = Form.useForm();

  
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<WorkoutType | 'all'>('all');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const filteredData = useMemo(() => {
    let data = [...workouts].sort((a, b) => b.date.localeCompare(a.date));

    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(
        (w) =>
          w.exerciseName.toLowerCase().includes(lower) ||
          w.notes.toLowerCase().includes(lower),
      );
    }
    if (filterType !== 'all') {
      data = data.filter((w) => w.type === filterType);
    }
    if (dateRange) {
      const [start, end] = dateRange;
      data = data.filter((w) => {
        const d = moment(w.date);
        return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
      });
    }
    return data;
  }, [workouts, searchText, filterType, dateRange]);

  const openAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ status: 'completed', date: moment() });
    setModalVisible(true);
  };

  const openEdit = (record: WorkoutEntry) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const entry = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (editingItem) {
        onEdit(editingItem.id, entry);
      } else {
        onAdd({ ...entry, id: genId() });
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <Text style={{ fontWeight: 500 }}>
          <CalendarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {formatDate(date)}
        </Text>
      ),
      sorter: (a: WorkoutEntry, b: WorkoutEntry) => a.date.localeCompare(b.date),
    },
    {
      title: 'Bài tập',
      dataIndex: 'exerciseName',
      key: 'exerciseName',
      width: 200,
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: WorkoutType) => (
        <Tag color={WORKOUT_TYPE_COLORS[type]} style={{ borderRadius: 4, fontWeight: 500 }}>
          {WORKOUT_TYPE_EMOJI[type]} {type}
        </Tag>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 110,
      render: (d: number) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
          {formatDuration(d)}
        </span>
      ),
      sorter: (a: WorkoutEntry, b: WorkoutEntry) => a.duration - b.duration,
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
      key: 'calories',
      width: 100,
      render: (c: number) => (
        <Text style={{ color: '#fa8c16', fontWeight: 600 }}>{c} kcal</Text>
      ),
      sorter: (a: WorkoutEntry, b: WorkoutEntry) => a.calories - b.calories,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes: string) => (
        <Tooltip title={notes}>
          <Text type="secondary">{notes || '—'}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (s: WorkoutStatus) => <WorkoutStatusTag status={s} />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: WorkoutEntry) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa buổi tập này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {}
      <Card bordered={false} className="th08-filter-card" bodyStyle={{ padding: '16px 20px' }} style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size={12} wrap>
              <Input
                placeholder="Tìm theo tên bài tập..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 240, borderRadius: 8 }}
              />
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 150 }}
                options={[
                  { value: 'all', label: 'Tất cả loại' },
                  ...WORKOUT_TYPES.map((t) => ({ value: t, label: t })),
                ]}
              />
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates as any)}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                style={{ borderRadius: 8 }}
              />
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAdd}
              style={{ borderRadius: 8, fontWeight: 500 }}
            >
              Thêm buổi tập
            </Button>
          </Col>
        </Row>
      </Card>

      {}
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          rowClassName={(_, index) => (index % 2 === 0 ? 'th08-row-even' : 'th08-row-odd')}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} buổi tập` }}
          size="middle"
          summary={(pageData) => {
            const totalDuration = pageData.reduce((sum, r) => sum + r.duration, 0);
            const totalCal = pageData.reduce((sum, r) => sum + r.calories, 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: '#f6ffed', fontWeight: 600 }}>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong style={{ color: '#52c41a' }}>📊 Tổng cộng ({pageData.length} buổi)</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong style={{ color: '#1890ff' }}>{formatDuration(totalDuration)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <Text strong style={{ color: '#fa8c16' }}>{totalCal.toLocaleString()} kcal</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={3} />
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      {}
      <Modal
        title={editingItem ? '✏️ Sửa buổi tập' : '➕ Thêm buổi tập mới'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày tập"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày' },
                  {
                    validator: (_, value) => {
                      if (value && value.isAfter(moment(), 'day')) {
                        return Promise.reject('Ngày tập không được ở tương lai');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%', borderRadius: 8 }}
                  disabledDate={(d) => d && d.isAfter(moment(), 'day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại bài tập"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
              >
                <Select
                  placeholder="Chọn loại"
                  options={WORKOUT_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="exerciseName"
            label="Tên bài tập"
            rules={[
              { required: true, message: 'Tên bài tập không được bỏ trống' },
              { min: 2, message: 'Tên bài tập phải có ít nhất 2 ký tự' },
            ]}
          >
            <Input placeholder="VD: Chạy bộ buổi sáng" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời lượng (phút)"
                rules={[
                  { required: true, message: 'Vui lòng nhập thời lượng' },
                  { type: 'number', min: 1, message: 'Thời lượng phải > 0' },
                ]}
              >
                <InputNumber
                  min={1}
                  max={600}
                  placeholder="30"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="phút"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="calories"
                label="Calo đốt cháy"
                rules={[
                  { required: true, message: 'Vui lòng nhập calo' },
                  { type: 'number', min: 1, message: 'Calo phải > 0' },
                ]}
              >
                <InputNumber
                  min={1}
                  max={5000}
                  placeholder="200"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="kcal"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú thêm..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio.Button value="completed">✅ Hoàn thành</Radio.Button>
              <Radio.Button value="missed">❌ Bỏ lỡ</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLog;
