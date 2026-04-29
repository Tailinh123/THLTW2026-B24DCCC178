import React, { useState, useMemo } from 'react';
import {
  Card, Row, Col, Button, Progress, Modal, Form, Input, InputNumber, Select,
  DatePicker, Popconfirm, Typography, Empty, Segmented, Space, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, AimOutlined,
  ClockCircleOutlined, AppstoreOutlined,
  SyncOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { Goal, GoalType } from '../types';
import { GOAL_TYPE_LABELS } from '../types';
import { GoalStatusTag } from '../components/StatusTag';
import { getGoalProgress } from '../utils/calculations';
import { formatDate } from '../utils/formatters';
import { genId } from '../mockData';

const { Text } = Typography;

const getDeadlineCountdown = (deadline: string): { text: string; color: string } => {
  const now = moment().startOf('day');
  const dl = moment(deadline).startOf('day');
  const diff = dl.diff(now, 'days');
  if (diff > 7) return { text: `Còn ${diff} ngày`, color: '#8c8c8c' };
  if (diff > 1) return { text: `Còn ${diff} ngày`, color: '#fa8c16' };
  if (diff === 1) return { text: 'Còn 1 ngày', color: '#fa8c16' };
  if (diff === 0) return { text: 'Hôm nay', color: '#1890ff' };
  return { text: `Quá hạn ${Math.abs(diff)} ngày`, color: '#f5222d' };
};

const GOAL_TYPES: GoalType[] = ['weight_loss', 'workout_count', 'calories_burned', 'running_distance', 'sleep_hours', 'other'];

const STATUS_OPTIONS = [
  { label: <span><AppstoreOutlined /> Tất cả</span>, value: 'all' },
  { label: <span><SyncOutlined /> Đang thực hiện</span>, value: 'active' },
  { label: <span><CheckCircleOutlined /> Hoàn thành</span>, value: 'completed' },
  { label: <span><CloseCircleOutlined /> Thất bại</span>, value: 'failed' },
];

const getProgressColor = (pct: number) => {
  if (pct >= 100) return '#52c41a';
  if (pct >= 60) return '#1890ff';
  if (pct >= 30) return '#faad14';
  return '#f5222d';
};

interface GoalsProps {
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onEdit: (id: string, goal: Partial<Goal>) => void;
  onDelete: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, onAdd, onEdit, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [form] = Form.useForm();

  const filteredGoals = useMemo(() => {
    if (filterStatus === 'all') return goals;
    return goals.filter((g) => g.status === filterStatus);
  }, [goals, filterStatus]);

  const openAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ status: 'active' });
    setModalVisible(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingItem(goal);
    form.setFieldsValue({ ...goal, deadline: moment(goal.deadline) });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const goal = { ...values, deadline: values.deadline.format('YYYY-MM-DD') };
      if (editingItem) {
        onEdit(editingItem.id, goal);
      } else {
        onAdd({ ...goal, id: genId() });
      }
      setModalVisible(false);
      form.resetFields();
    } catch { /* validation */ }
  };

  const handleInlineUpdate = (id: string, newValue: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const updatedGoal: Partial<Goal> = { currentValue: newValue };
    if (goal.type === 'weight_loss') {
      if (newValue <= goal.targetValue) updatedGoal.status = 'completed';
    } else {
      if (newValue >= goal.targetValue) updatedGoal.status = 'completed';
    }
    onEdit(id, updatedGoal);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Segmented
          options={STATUS_OPTIONS}
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as string)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
          Thêm mục tiêu
        </Button>
      </div>

      {/* Cards */}
      {filteredGoals.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredGoals.map((goal) => {
            const pct = getGoalProgress(goal);
            const color = getProgressColor(pct);
            const countdown = getDeadlineCountdown(goal.deadline);
            const isDone = goal.status !== 'active';

            return (
              <Col span={8} key={goal.id}>
                <div className={`th08-goal-card ${isDone ? 'th08-goal-done' : ''}`}>
                  {/* Row 1: Status tag + Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.4, display: 'block' }}>
                        {goal.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {GOAL_TYPE_LABELS[goal.type]}
                      </Text>
                    </div>
                    <GoalStatusTag status={goal.status} />
                  </div>

                  {/* Row 2: Big value */}
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 10, marginTop: 8 }}>
                    {goal.status === 'active' ? (
                      <span className="th08-goal-value-input">
                        <InputNumber
                          value={goal.currentValue}
                          min={0}
                          step={goal.type === 'sleep_hours' ? 0.5 : 1}
                          bordered={false}
                          controls={false}
                          onChange={(val) => { if (val !== null) handleInlineUpdate(goal.id, val); }}
                        />
                      </span>
                    ) : (
                      <span style={{ fontSize: 28, fontWeight: 700, color: '#262626', lineHeight: 1 }}>
                        {goal.currentValue}
                      </span>
                    )}
                    <span style={{ fontSize: 13, color: '#8c8c8c', marginLeft: 4 }}>
                      / {goal.targetValue} {goal.unit}
                    </span>
                  </div>

                  {/* Row 3: Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <Progress percent={pct} strokeColor={color} showInfo={false} strokeWidth={6} />
                    </div>
                    <Text strong style={{ fontSize: 12, color, flexShrink: 0, minWidth: 36, textAlign: 'right' }}>
                      {pct}%
                    </Text>
                  </div>

                  {/* Row 4: Footer — divider + deadline + actions */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        <ClockCircleOutlined style={{ marginRight: 3 }} />
                        {formatDate(goal.deadline)}
                      </Text>
                      {countdown.color !== '#8c8c8c' && (
                        <Text style={{ fontSize: 11, color: countdown.color, marginLeft: 6 }}>
                          {countdown.text}
                        </Text>
                      )}
                      {countdown.color === '#8c8c8c' && (
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                          {countdown.text}
                        </Text>
                      )}
                    </div>
                    <Space size={0}>
                      <Tooltip title="Sửa">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(goal)} style={{ color: '#8c8c8c' }} />
                      </Tooltip>
                      <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => onDelete(goal.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Tooltip title="Xóa">
                          <Button type="text" size="small" icon={<DeleteOutlined />} style={{ color: '#bfbfbf' }} />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Empty description="Không có mục tiêu nào" />
        </Card>
      )}

      {/* Modal */}
      <Modal
        title={editingItem ? 'Chỉnh sửa mục tiêu' : 'Tạo mục tiêu mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        width={520}
        centered
        okText={editingItem ? 'Lưu thay đổi' : 'Tạo mục tiêu'}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Nhập tên' }, { min: 3, message: 'Tối thiểu 3 ký tự' }]}>
            <Input placeholder="VD: Giảm cân xuống 65kg" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="type" label="Loại" rules={[{ required: true, message: 'Chọn loại' }]}>
                <Select placeholder="Chọn loại" options={GOAL_TYPES.map((t) => ({ value: t, label: GOAL_TYPE_LABELS[t] }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="Đơn vị" rules={[{ required: true, message: 'Nhập đơn vị' }]}>
                <Input placeholder="kg, buổi, kcal..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="targetValue" label="Mục tiêu" rules={[{ required: true }, { type: 'number', min: 0.1 }]}>
                <InputNumber min={0.1} style={{ width: '100%' }} placeholder="50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currentValue" label="Hiện tại" rules={[{ required: true }, { type: 'number', min: 0 }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="30" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn ngày' }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'active', label: 'Đang thực hiện' },
                  { value: 'completed', label: 'Hoàn thành' },
                  { value: 'failed', label: 'Thất bại' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Goals;
