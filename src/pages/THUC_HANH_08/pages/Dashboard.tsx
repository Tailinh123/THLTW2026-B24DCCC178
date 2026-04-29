import React, { useMemo, useState } from 'react';
import {
  Row, Col, Card, Typography, Empty, Button, Space,
  Modal, Form, Input, InputNumber, Select, DatePicker, Radio,
} from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  AimOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  HeartOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import moment from 'moment';
import type { WorkoutEntry, HealthRecord, Goal, WorkoutType } from '../types';
import { WORKOUT_TYPE_COLORS } from '../types';
import {
  calculateStreak,
  getMonthlyStats,
  getWeeklyWorkoutCounts,
  getCompletedGoalsPercent,
  calculateBMI,
} from '../utils/calculations';
import { formatDate, formatNumber, timeAgo, formatDuration } from '../utils/formatters';
import StatCard from '../components/StatCard';
import BMITag from '../components/BMITag';
import { genId } from '../mockData';

const { Text, Title } = Typography;
const { TextArea } = Input;

const WORKOUT_TYPES: WorkoutType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const WORKOUT_TYPE_EMOJI: Record<WorkoutType, string> = {
  Cardio: '🏃', Strength: '🏋️', Yoga: '🧘', HIIT: '⚡', Other: '⚽',
};

interface DashboardProps {
  workouts: WorkoutEntry[];
  health: HealthRecord[];
  goals: Goal[];
  onAddWorkout: (entry: WorkoutEntry) => void;
  onAddHealth: (record: HealthRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, health, goals, onAddWorkout, onAddHealth }) => {
  const monthlyStats = useMemo(() => getMonthlyStats(workouts), [workouts]);
  const streak = useMemo(() => calculateStreak(workouts), [workouts]);
  const goalsPct = useMemo(() => getCompletedGoalsPercent(goals), [goals]);
  const weeklyData = useMemo(() => getWeeklyWorkoutCounts(workouts), [workouts]);

  // Weight chart data — sort by date ascending
  const weightData = useMemo(() => {
    return [...health]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((h) => ({
        date: formatDate(h.date),
        weight: h.weight,
      }));
  }, [health]);

  // 5 buổi tập gần nhất
  const recentWorkouts = useMemo(() => {
    return [...workouts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [workouts]);

  // ===== Quick Action Modals =====
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [workoutForm] = Form.useForm();
  const [healthForm] = Form.useForm();
  const [previewBMI, setPreviewBMI] = useState(0);

  const handleAddWorkout = async () => {
    try {
      const values = await workoutForm.validateFields();
      onAddWorkout({
        ...values,
        id: genId(),
        date: values.date.format('YYYY-MM-DD'),
      });
      setWorkoutModalVisible(false);
      workoutForm.resetFields();
    } catch { /* validation */ }
  };

  const handleAddHealth = async () => {
    try {
      const values = await healthForm.validateFields();
      const bmi = calculateBMI(values.weight, values.height);
      onAddHealth({
        ...values,
        id: genId(),
        date: values.date.format('YYYY-MM-DD'),
        bmi,
      });
      setHealthModalVisible(false);
      healthForm.resetFields();
      setPreviewBMI(0);
    } catch { /* validation */ }
  };

  return (
    <div className="th08-dashboard">
      {/* ===== Quick Action Row ===== */}
      <Card
        bordered={false}
        bodyStyle={{ padding: '14px 20px' }}
        style={{ marginBottom: 20, borderRadius: 12, background: 'linear-gradient(135deg, #e6f7ff, #f0f5ff)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 14, color: '#434343' }}>⚡ Thao tác nhanh</Text>
          <Space size={12}>
            <Button
              type="primary"
              icon={<ScheduleOutlined />}
              onClick={() => {
                workoutForm.resetFields();
                workoutForm.setFieldsValue({ status: 'completed', date: moment() });
                setWorkoutModalVisible(true);
              }}
              style={{ borderRadius: 8, fontWeight: 500, background: 'linear-gradient(135deg, #1890ff, #69c0ff)', border: 'none' }}
            >
              Thêm buổi tập
            </Button>
            <Button
              icon={<HeartOutlined />}
              onClick={() => {
                healthForm.resetFields();
                healthForm.setFieldsValue({ date: moment() });
                setPreviewBMI(0);
                setHealthModalVisible(true);
              }}
              style={{ borderRadius: 8, fontWeight: 500, background: 'linear-gradient(135deg, #52c41a, #95de64)', border: 'none', color: '#fff' }}
            >
              Ghi chỉ số sức khỏe
            </Button>
          </Space>
        </div>
      </Card>

      {/* ===== KPI Cards ===== */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard
            icon={<FireOutlined />}
            label="Buổi tập trong tháng"
            value={monthlyStats.totalSessions}
            suffix="buổi"
            color="#1890ff"
            bgGradient="linear-gradient(135deg, #1890ff, #69c0ff)"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<ThunderboltOutlined />}
            label="Calo đã đốt"
            value={formatNumber(monthlyStats.totalCalories)}
            suffix="kcal"
            color="#fa8c16"
            bgGradient="linear-gradient(135deg, #fa8c16, #ffc53d)"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<TrophyOutlined />}
            label="Streak liên tiếp"
            value={streak}
            suffix="ngày"
            color="#52c41a"
            bgGradient="linear-gradient(135deg, #52c41a, #95de64)"
          />
        </Col>
        <Col span={6}>
          <StatCard
            icon={<AimOutlined />}
            label="Mục tiêu hoàn thành"
            value={goalsPct}
            suffix="%"
            color="#722ed1"
            bgGradient="linear-gradient(135deg, #722ed1, #b37feb)"
          />
        </Col>
      </Row>

      {/* ===== Charts Row ===== */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Bar Chart — Weekly workout count */}
        <Col span={12}>
          <Card
            bordered={false}
            className="th08-chart-card"
            title={
              <span style={{ fontWeight: 600 }}>
                📊 Buổi tập theo tuần (tháng này)
              </span>
            }
            bodyStyle={{ padding: '12px 20px 20px' }}
          >
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
                    formatter={(value: number) => [`${value} buổi`, 'Số buổi tập']}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1890ff" />
                      <stop offset="100%" stopColor="#69c0ff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Chưa có dữ liệu" />
            )}
          </Card>
        </Col>

        {/* Area Chart — Weight over time */}
        <Col span={12}>
          <Card
            bordered={false}
            className="th08-chart-card"
            title={
              <span style={{ fontWeight: 600 }}>
                📈 Cân nặng theo thời gian
              </span>
            }
            bodyStyle={{ padding: '12px 20px 20px' }}
          >
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    unit=" kg"
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
                    formatter={(value: number) => [`${value} kg`, 'Cân nặng']}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52c41a" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#52c41a" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#52c41a"
                    strokeWidth={2.5}
                    fill="url(#areaGradient)"
                    dot={{ r: 4, fill: '#52c41a', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Chưa có dữ liệu" />
            )}
          </Card>
        </Col>
      </Row>

      {/* ===== Recent Workouts ===== */}
      <Card
        bordered={false}
        className="th08-chart-card"
        title={
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            🏃 Hoạt động gần đây
          </span>
        }
        bodyStyle={{ padding: '12px 20px 20px' }}
      >
        {recentWorkouts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#fafbfc',
                  border: '1px solid #f0f0f0',
                  borderLeft: `4px solid ${WORKOUT_TYPE_COLORS[w.type]}`,
                  transition: 'all 0.2s',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${WORKOUT_TYPE_COLORS[w.type]}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {WORKOUT_TYPE_EMOJI[w.type]}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 14, display: 'block' }}>
                    {w.exerciseName}
                  </Text>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 11, color: '#8c8c8c',
                      background: '#f0f0f0', borderRadius: 6, padding: '1px 8px',
                    }}>
                      <ClockCircleOutlined style={{ marginRight: 3 }} />
                      {formatDuration(w.duration)}
                    </span>
                    <span style={{
                      fontSize: 11, color: '#fa8c16',
                      background: '#fff7e6', borderRadius: 6, padding: '1px 8px',
                    }}>
                      🔥 {w.calories} kcal
                    </span>
                    <span style={{
                      fontSize: 11, color: WORKOUT_TYPE_COLORS[w.type],
                      background: `${WORKOUT_TYPE_COLORS[w.type]}12`,
                      borderRadius: 6, padding: '1px 8px', fontWeight: 500,
                    }}>
                      {w.type}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Text style={{ fontSize: 12, color: '#8c8c8c', display: 'block' }}>
                    {timeAgo(w.date)}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#bfbfbf' }}>
                    {formatDate(w.date)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="Chưa có buổi tập nào" />
        )}
      </Card>

      {/* ===== Quick Add Workout Modal ===== */}
      <Modal
        title="⚡ Thêm buổi tập nhanh"
        visible={workoutModalVisible}
        onOk={handleAddWorkout}
        onCancel={() => setWorkoutModalVisible(false)}
        okText="Thêm mới"
        cancelText="Hủy"
        destroyOnClose
        width={520}
      >
        <Form form={workoutForm} layout="vertical" requiredMark="optional">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Chọn ngày' }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabledDate={(d) => d && d.isAfter(moment(), 'day')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Loại" rules={[{ required: true, message: 'Chọn loại' }]}>
                <Select options={WORKOUT_TYPES.map((t) => ({ value: t, label: `${WORKOUT_TYPE_EMOJI[t]} ${t}` }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="exerciseName" label="Tên bài tập" rules={[{ required: true, message: 'Nhập tên' }, { min: 2 }]}>
            <Input placeholder="VD: Chạy bộ buổi sáng" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }, { type: 'number', min: 1 }]}>
                <InputNumber min={1} max={600} style={{ width: '100%' }} addonAfter="phút" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calories" label="Calo" rules={[{ required: true }, { type: 'number', min: 1 }]}>
                <InputNumber min={1} max={5000} style={{ width: '100%' }} addonAfter="kcal" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú..." />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value="completed">✅ Hoàn thành</Radio.Button>
              <Radio.Button value="missed">❌ Bỏ lỡ</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== Quick Add Health Modal ===== */}
      <Modal
        title="⚡ Ghi chỉ số sức khỏe nhanh"
        visible={healthModalVisible}
        onOk={handleAddHealth}
        onCancel={() => setHealthModalVisible(false)}
        okText="Thêm mới"
        cancelText="Hủy"
        destroyOnClose
        width={480}
      >
        <Form
          form={healthForm}
          layout="vertical"
          requiredMark="optional"
          onValuesChange={(_, all) => {
            if (all.weight > 0 && all.height > 0) setPreviewBMI(calculateBMI(all.weight, all.height));
          }}
        >
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabledDate={(d) => d && d.isAfter(moment(), 'day')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="weight" label="Cân nặng" rules={[{ required: true }, { type: 'number', min: 20 }]}>
                <InputNumber min={20} max={300} step={0.1} precision={1} style={{ width: '100%' }} addonAfter="kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="height" label="Chiều cao" rules={[{ required: true }, { type: 'number', min: 50 }]}>
                <InputNumber min={50} max={250} step={0.1} precision={1} style={{ width: '100%' }} addonAfter="cm" />
              </Form.Item>
            </Col>
          </Row>
          {previewBMI > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fafafa', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Text type="secondary">BMI:</Text>
              <BMITag bmi={previewBMI} />
            </div>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="heartRate" label="Nhịp tim" rules={[{ required: true }, { type: 'number', min: 30, max: 250 }]}>
                <InputNumber min={30} max={250} style={{ width: '100%' }} addonAfter="bpm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true }, { type: 'number', min: 0, max: 24 }]}>
                <InputNumber min={0} max={24} step={0.5} precision={1} style={{ width: '100%' }} addonAfter="giờ" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
