import React, { useState, useMemo } from 'react';
import {
  Card, Row, Col, Button, Modal, Form, Input, InputNumber, Select, Tag,
  Popconfirm, Typography, Space, Empty, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  EyeOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import type { Exercise, MuscleGroup, Difficulty } from '../types';
import DifficultyTag from '../components/DifficultyTag';
import { genId } from '../mockData';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Meta } = Card;

const MUSCLE_GROUPS: MuscleGroup[] = ['Ngực', 'Lưng', 'Vai', 'Tay trước', 'Tay sau', 'Chân', 'Bụng', 'Toàn thân', 'Khác'];
const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const MUSCLE_COLORS: Record<string, string> = {
  'Ngực': '#1890ff',
  'Lưng': '#722ed1',
  'Vai': '#13c2c2',
  'Tay trước': '#eb2f96',
  'Tay sau': '#fa541c',
  'Chân': '#52c41a',
  'Bụng': '#faad14',
  'Toàn thân': '#2f54eb',
  'Khác': '#8c8c8c',
};

const MUSCLE_EMOJI: Record<string, string> = {
  'Ngực': '💪',
  'Lưng': '🪴',
  'Vai': '🏋️',
  'Tay trước': '💪',
  'Tay sau': '🦿',
  'Chân': '🦵',
  'Bụng': '🫁',
  'Toàn thân': '🏃',
  'Khác': '🎯',
};

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
  onEdit: (id: string, exercise: Partial<Exercise>) => void;
  onDelete: (id: string) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ exercises, onAdd, onEdit, onDelete }) => {
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Exercise | null>(null);
  const [viewingItem, setViewingItem] = useState<Exercise | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');

  const filteredData = useMemo(() => {
    let data = [...exercises];
    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower),
      );
    }
    if (filterMuscle !== 'all') {
      data = data.filter((e) => e.muscleGroup === filterMuscle);
    }
    if (filterDiff !== 'all') {
      data = data.filter((e) => e.difficulty === filterDiff);
    }
    return data;
  }, [exercises, searchText, filterMuscle, filterDiff]);

  const openAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const openEdit = (exercise: Exercise) => {
    setEditingItem(exercise);
    form.setFieldsValue(exercise);
    setFormModalVisible(true);
  };

  const openDetail = (exercise: Exercise) => {
    setViewingItem(exercise);
    setDetailModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        onEdit(editingItem.id, values);
      } else {
        onAdd({ ...values, id: genId() });
      }
      setFormModalVisible(false);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  return (
    <div>
      {/* Filter Bar */}
      <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ marginBottom: 20, borderRadius: 12 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size={12} wrap>
              <Input
                placeholder="Tìm kiếm bài tập..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 250, borderRadius: 8 }}
              />
              <Select
                value={filterMuscle}
                onChange={setFilterMuscle}
                style={{ width: 160 }}
                options={[
                  { value: 'all', label: 'Tất cả nhóm cơ' },
                  ...MUSCLE_GROUPS.map((m) => ({ value: m, label: m })),
                ]}
              />
              <Select
                value={filterDiff}
                onChange={setFilterDiff}
                style={{ width: 160 }}
                options={[
                  { value: 'all', label: 'Tất cả mức độ' },
                  ...DIFFICULTIES.map((d) => ({
                    value: d,
                    label: d === 'Beginner' ? '🟢 Cơ bản' : d === 'Intermediate' ? '🟡 Trung bình' : '🔴 Nâng cao',
                  })),
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8, fontWeight: 500 }}>
              Thêm bài tập
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Exercise Cards Grid */}
      {filteredData.length > 0 ? (
        <Row gutter={[20, 20]}>
          {filteredData.map((exercise) => (
            <Col span={8} key={exercise.id}>
              <Card
                bordered={false}
                hoverable
                className="th08-exercise-card"
                style={{ borderRadius: 16, height: '100%' }}
                bodyStyle={{ padding: '20px 24px' }}
                onClick={() => openDetail(exercise)}
                actions={[
                  <Tooltip title="Xem chi tiết" key="view">
                    <Button type="text" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); openDetail(exercise); }}>
                      Chi tiết
                    </Button>
                  </Tooltip>,
                  <Tooltip title="Sửa" key="edit">
                    <Button type="text" icon={<EditOutlined />} style={{ color: '#1890ff' }} onClick={(e) => { e.stopPropagation(); openEdit(exercise); }}>
                      Sửa
                    </Button>
                  </Tooltip>,
                  <Popconfirm
                    key="delete"
                    title="Xác nhận xóa bài tập này?"
                    onConfirm={() => onDelete(exercise.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>
                      Xóa
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div style={{ marginBottom: 12 }}>
                  <Title level={5} style={{ margin: '0 0 8px 0' }}>{exercise.name}</Title>
                  <Space size={6}>
                    <Tag color={MUSCLE_COLORS[exercise.muscleGroup]} style={{ borderRadius: 4 }}>
                      {MUSCLE_EMOJI[exercise.muscleGroup]} {exercise.muscleGroup}
                    </Tag>
                    <DifficultyTag difficulty={exercise.difficulty} />
                  </Space>
                </div>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 12, fontSize: 13, minHeight: 40 }}
                >
                  {exercise.description}
                </Paragraph>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #fff7e6, #fff2f0)',
                }}>
                  <ThunderboltOutlined style={{ color: '#fa8c16', marginRight: 8, fontSize: 16 }} />
                  <Text strong style={{ color: '#fa8c16' }}>{exercise.caloriesPerHour}</Text>
                  <Text type="secondary" style={{ marginLeft: 4, fontSize: 12 }}>kcal/giờ</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Empty description="Không tìm thấy bài tập nào" />
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        title={viewingItem ? `📖 ${viewingItem.name}` : 'Chi tiết bài tập'}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={560}
      >
        {viewingItem && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space size={8}>
                <Tag color={MUSCLE_COLORS[viewingItem.muscleGroup]} style={{ borderRadius: 4, fontSize: 13 }}>
                  {MUSCLE_EMOJI[viewingItem.muscleGroup]} {viewingItem.muscleGroup}
                </Tag>
                <DifficultyTag difficulty={viewingItem.difficulty} />
                <Tag color="orange" style={{ borderRadius: 4 }}>
                  <ThunderboltOutlined /> {viewingItem.caloriesPerHour} kcal/giờ
                </Tag>
              </Space>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 6 }}>Mô tả</Text>
              <Paragraph style={{ fontSize: 13, color: '#595959' }}>{viewingItem.description}</Paragraph>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: 12,
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8, color: '#52c41a' }}>
                📋 Hướng dẫn thực hiện
              </Text>
              <pre style={{
                margin: 0,
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                fontSize: 13,
                color: '#434343',
                lineHeight: 1.8,
              }}>
                {viewingItem.instructions}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        title={editingItem ? '✏️ Sửa bài tập' : '➕ Thêm bài tập mới'}
        visible={formModalVisible}
        onOk={handleSubmit}
        onCancel={() => setFormModalVisible(false)}
        okText={editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[
              { required: true, message: 'Tên bài tập không được bỏ trống' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
            ]}
          >
            <Input placeholder="VD: Bench Press" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="muscleGroup"
                label="Nhóm cơ"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}
              >
                <Select
                  placeholder="Chọn nhóm cơ"
                  options={MUSCLE_GROUPS.map((m) => ({ value: m, label: `${MUSCLE_EMOJI[m]} ${m}` }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="Mức độ khó"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
              >
                <Select
                  placeholder="Chọn mức độ"
                  options={DIFFICULTIES.map((d) => ({
                    value: d,
                    label: d === 'Beginner' ? '🟢 Cơ bản' : d === 'Intermediate' ? '🟡 Trung bình' : '🔴 Nâng cao',
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
            ]}
          >
            <TextArea rows={2} placeholder="Mô tả ngắn gọn bài tập..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="instructions"
            label="Hướng dẫn thực hiện"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
          >
            <TextArea rows={4} placeholder="Các bước thực hiện bài tập..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="caloriesPerHour"
            label="Calo đốt mỗi giờ"
            rules={[
              { required: true, message: 'Vui lòng nhập calo' },
              { type: 'number', min: 50, message: 'Calo phải ≥ 50' },
            ]}
          >
            <InputNumber
              min={50}
              max={2000}
              placeholder="300"
              style={{ width: '100%', borderRadius: 8 }}
              addonAfter="kcal/giờ"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;
