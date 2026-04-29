import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Space, Modal, Form, InputNumber, DatePicker,
  Popconfirm, Typography, Row, Col, Tooltip, Statistic,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined, CalendarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { HealthRecord } from '../types';
import BMITag from '../components/BMITag';
import { calculateBMI, getBMICategory } from '../utils/calculations';
import { formatDate } from '../utils/formatters';
import { genId } from '../mockData';

const { Text } = Typography;

interface HealthMetricsProps {
  health: HealthRecord[];
  onAdd: (record: HealthRecord) => void;
  onEdit: (id: string, record: Partial<HealthRecord>) => void;
  onDelete: (id: string) => void;
}

const HealthMetrics: React.FC<HealthMetricsProps> = ({ health, onAdd, onEdit, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<HealthRecord | null>(null);
  const [form] = Form.useForm();
  const [previewBMI, setPreviewBMI] = useState<number>(0);

  const sortedData = useMemo(() => {
    return [...health].sort((a, b) => b.date.localeCompare(a.date));
  }, [health]);

  // Latest stats
  const latest = sortedData[0];

  const openAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ date: moment() });
    setPreviewBMI(0);
    setModalVisible(true);
  };

  const openEdit = (record: HealthRecord) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setPreviewBMI(record.bmi);
    setModalVisible(true);
  };

  const handleValuesChange = (_: any, allValues: any) => {
    const { weight, height } = allValues;
    if (weight > 0 && height > 0) {
      setPreviewBMI(calculateBMI(weight, height));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const bmi = calculateBMI(values.weight, values.height);
      const record = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        bmi,
      };

      if (editingItem) {
        onEdit(editingItem.id, record);
      } else {
        onAdd({ ...record, id: genId() });
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 130,
      render: (date: string) => (
        <Text style={{ fontWeight: 500 }}>
          <CalendarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {formatDate(date)}
        </Text>
      ),
      sorter: (a: HealthRecord, b: HealthRecord) => a.date.localeCompare(b.date),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 130,
      render: (w: number) => <Text strong>{w} kg</Text>,
      sorter: (a: HealthRecord, b: HealthRecord) => a.weight - b.weight,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
      width: 130,
      render: (h: number) => <Text>{h} cm</Text>,
    },
    {
      title: (
        <span>
          BMI{' '}
          <Tooltip
            title={
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>📋 Phân loại BMI (WHO)</div>
                <div>🔵 <b>&lt; 18.5</b> — Thiếu cân</div>
                <div>🟢 <b>18.5 – 24.9</b> — Bình thường</div>
                <div>🟡 <b>25 – 29.9</b> — Thừa cân</div>
                <div>🔴 <b>≥ 30</b> — Béo phì</div>
              </div>
            }
            placement="top"
            overlayStyle={{ maxWidth: 260 }}
          >
            <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'pointer', marginLeft: 4 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'bmi',
      key: 'bmi',
      width: 180,
      render: (bmi: number) => <BMITag bmi={bmi} />,
      sorter: (a: HealthRecord, b: HealthRecord) => a.bmi - b.bmi,
    },
    {
      title: 'Nhịp tim (bpm)',
      dataIndex: 'heartRate',
      key: 'heartRate',
      width: 140,
      render: (hr: number) => (
        <span>
          <HeartOutlined style={{ color: '#f5222d', marginRight: 6 }} />
          <Text style={{ fontWeight: 500 }}>{hr}</Text>
          <Text type="secondary"> bpm</Text>
        </span>
      ),
      sorter: (a: HealthRecord, b: HealthRecord) => a.heartRate - b.heartRate,
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
      width: 110,
      render: (h: number) => (
        <Text style={{ color: h >= 7 ? '#52c41a' : '#fa8c16', fontWeight: 500 }}>
          {h}h
        </Text>
      ),
      sorter: (a: HealthRecord, b: HealthRecord) => a.sleepHours - b.sleepHours,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: HealthRecord) => (
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
            title="Xác nhận xóa bản ghi này?"
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
      {/* Summary Cards */}
      {latest && (
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ textAlign: 'center', padding: '16px' }}>
              <Statistic title="Cân nặng hiện tại" value={latest.weight} suffix="kg" valueStyle={{ color: '#1890ff', fontWeight: 700 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ textAlign: 'center', padding: '16px' }}>
              <Statistic title="Chiều cao" value={latest.height} suffix="cm" valueStyle={{ fontWeight: 700 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ textAlign: 'center', padding: '16px' }}>
              <Statistic
                title="BMI hiện tại"
                value={latest.bmi}
                precision={1}
                valueStyle={{ color: getBMICategory(latest.bmi).color === 'green' ? '#52c41a' : getBMICategory(latest.bmi).color === 'gold' ? '#faad14' : getBMICategory(latest.bmi).color === 'red' ? '#f5222d' : '#1890ff', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ textAlign: 'center', padding: '16px' }}>
              <Statistic title="Nhịp tim nghỉ" value={latest.heartRate} suffix="bpm" prefix={<HeartOutlined />} valueStyle={{ color: '#f5222d', fontWeight: 700 }} />
            </Card>
          </Col>
        </Row>
      )}

      {/* Table */}
      <Card
        bordered={false}
        style={{ borderRadius: 12, overflow: 'hidden' }}
        bodyStyle={{ padding: 0 }}
        title={<Text strong style={{ fontSize: 16 }}>📋 Nhật ký chỉ số sức khỏe</Text>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8, fontWeight: 500 }}>
            Thêm bản ghi
          </Button>
        }
      >
        <Table
          dataSource={sortedData}
          columns={columns}
          rowKey="id"
          rowClassName={(_, index) => (index % 2 === 0 ? 'th08-row-even' : 'th08-row-odd')}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
          size="middle"
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={editingItem ? '✏️ Sửa chỉ số sức khỏe' : '➕ Thêm chỉ số mới'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            name="date"
            label="Ngày ghi nhận"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày' },
              {
                validator: (_, value) => {
                  if (value && value.isAfter(moment(), 'day')) {
                    return Promise.reject('Ngày không được ở tương lai');
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
                rules={[
                  { required: true, message: 'Vui lòng nhập cân nặng' },
                  { type: 'number', min: 20, message: 'Cân nặng phải ≥ 20kg' },
                  { type: 'number', max: 300, message: 'Cân nặng phải ≤ 300kg' },
                ]}
              >
                <InputNumber
                  min={20}
                  max={300}
                  step={0.1}
                  precision={1}
                  placeholder="70.0"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="kg"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="height"
                label="Chiều cao (cm)"
                rules={[
                  { required: true, message: 'Vui lòng nhập chiều cao' },
                  { type: 'number', min: 50, message: 'Chiều cao phải ≥ 50cm' },
                  { type: 'number', max: 250, message: 'Chiều cao phải ≤ 250cm' },
                ]}
              >
                <InputNumber
                  min={50}
                  max={250}
                  step={0.1}
                  precision={1}
                  placeholder="175.0"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="cm"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* BMI Preview */}
          {previewBMI > 0 && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#fafafa',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Text type="secondary">BMI tự động tính:</Text>
              <BMITag bmi={previewBMI} />
            </div>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="heartRate"
                label="Nhịp tim lúc nghỉ (bpm)"
                rules={[
                  { required: true, message: 'Vui lòng nhập nhịp tim' },
                  { type: 'number', min: 30, message: 'Nhịp tim phải ≥ 30 bpm' },
                  { type: 'number', max: 250, message: 'Nhịp tim phải ≤ 250 bpm' },
                ]}
              >
                <InputNumber
                  min={30}
                  max={250}
                  placeholder="70"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="bpm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sleepHours"
                label="Giờ ngủ"
                rules={[
                  { required: true, message: 'Vui lòng nhập giờ ngủ' },
                  { type: 'number', min: 0, message: 'Giờ ngủ phải ≥ 0' },
                  { type: 'number', max: 24, message: 'Giờ ngủ phải ≤ 24' },
                ]}
              >
                <InputNumber
                  min={0}
                  max={24}
                  step={0.5}
                  precision={1}
                  placeholder="7.5"
                  style={{ width: '100%', borderRadius: 8 }}
                  addonAfter="giờ"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthMetrics;
