import React, { useState, useEffect, useMemo } from 'react';
import {
  Row, Col, Card, Statistic, Alert, Button, Space, Modal, Form, Input, InputNumber,
  Select, Upload, Table, Tabs, Tag, Typography, Rate, Popconfirm, Divider, message,
} from 'antd';
import {
  PlusOutlined, UploadOutlined, DollarOutlined, ClockCircleOutlined,
  CalendarOutlined, LinkOutlined, DeleteOutlined, EditOutlined,
  LoginOutlined, LogoutOutlined, ExclamationCircleOutlined, BarChartOutlined,
  UnorderedListOutlined, StarFilled, SaveOutlined,
} from '@ant-design/icons';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import {
  BarChart, Bar, LineChart, Line as ReLine, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { DestinationCard, FilterSortBar, BudgetChart, ItineraryDayCard } from './components';
import { useDestinations, useItinerary, useBudget } from './hooks';
import { useAppDispatch, useAppSelector } from './store';
import { adminActions } from './slices';
import type { Destination, FilterOptions, DestinationType } from './types';
import {
  formatVND, totalCost, genId, DEST_TYPE_LABELS, DEST_TYPE_COLORS, CATEGORY_LABELS,
  MAX_PER_DAY, ADMIN_CREDENTIALS,
} from './types';

const { Text } = Typography;
const { TabPane } = Tabs;


export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    types: [],
    priceRange: [0, 5000000],
    minRating: 0,
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  const { destinations } = useDestinations(filters);
  const { itinerary, addItemToDay, addDay } = useItinerary();

  const handleAddToItinerary = (destId: string) => {
    if (itinerary.days.length === 0) {
      addDay();
      setTimeout(() => {
        message.info('Đã tạo Ngày 1 và thêm điểm đến. Vào tab Lịch trình để xem!');
      }, 100);
      return;
    }
    const lastDay = itinerary.days[itinerary.days.length - 1];
    if (lastDay.items.length >= MAX_PER_DAY) {
      message.warning(`Ngày ${lastDay.dayNumber} đã đầy (${MAX_PER_DAY} điểm). Hãy thêm ngày mới!`);
      return;
    }
    addItemToDay(lastDay.id, destId);
    message.success('Đã thêm vào lịch trình!');
  };

  return (
    <div>
      <FilterSortBar value={filters} onChange={setFilters} />
      <Row gutter={[20, 20]}>
        {destinations.map((dest) => (
          <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
            <DestinationCard destination={dest} onAdd={handleAddToItinerary} />
          </Col>
        ))}
        {destinations.length === 0 && (
          <Col span={24}>
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">Không tìm thấy điểm đến phù hợp. Thử thay đổi bộ lọc!</Text>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};


export const ItineraryPage: React.FC = () => {
  const {
    itinerary, addDay, removeDay, addItemToDay, removeItem,
    reorderItems, moveItemBetweenDays, renameTrip, getDestById,
    totalBudget, totalDuration, travelTimeByDay, save,
  } = useItinerary();
  const { allDestinations } = useDestinations();
  const [pickerDay, setPickerDay] = useState<string | null>(null);
  const [tripName, setTripName] = useState(itinerary.name);

  useEffect(() => {
    setTripName(itinerary.name);
  }, [itinerary.name]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      reorderItems(source.droppableId, source.index, destination.index);
    } else {
      moveItemBetweenDays(source.droppableId, destination.droppableId, source.index, destination.index);
    }
  };

  const handleSave = async () => {
    renameTrip(tripName);
    await save();
    message.success('Đã lưu lịch trình!');
  };

  const handlePickDest = (destId: string) => {
    if (pickerDay) {
      const day = itinerary.days.find((d) => d.id === pickerDay);
      if (day && day.items.length >= MAX_PER_DAY) {
        message.warning(`Ngày ${day.dayNumber} đã đầy!`);
        return;
      }
      addItemToDay(pickerDay, destId);
      setPickerDay(null);
      message.success('Đã thêm điểm đến!');
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 20 }}>
        <Col flex="auto">
          <Space>
            <Input
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              style={{ fontWeight: 700, fontSize: 18, width: 280, border: 'none', borderBottom: '2px solid #1890ff' }}
              placeholder="Tên chuyến đi"
            />
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Lưu
            </Button>
          </Space>
        </Col>
      </Row>

      <div className="itinerary-stats">
        <Card className="stat-card" style={{ flex: 1, minWidth: 160, background: '#e6f7ff', borderColor: '#91d5ff' }}>
          <div className="stat-card-inner">
            <Statistic title={<Text strong>Tổng ngân sách</Text>} value={totalBudget} formatter={(v) => formatVND(Number(v))} valueStyle={{ color: '#1890ff', fontWeight: 700 }} />
            <div className="stat-card-icon" style={{ color: '#1890ff' }}><DollarOutlined /></div>
          </div>
        </Card>
        <Card className="stat-card" style={{ flex: 1, minWidth: 160, background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <div className="stat-card-inner">
            <Statistic title={<Text strong>Thời gian tham quan</Text>} value={totalDuration} suffix="giờ" valueStyle={{ color: '#52c41a', fontWeight: 700 }} />
            <div className="stat-card-icon" style={{ color: '#52c41a' }}><ClockCircleOutlined /></div>
          </div>
        </Card>
        <Card className="stat-card" style={{ flex: 1, minWidth: 160, background: '#fff7e6', borderColor: '#ffd591' }}>
          <div className="stat-card-inner">
            <Statistic title={<Text strong>Số ngày</Text>} value={itinerary.days.length} suffix="ngày" valueStyle={{ color: '#fa8c16', fontWeight: 700 }} />
            <div className="stat-card-icon" style={{ color: '#fa8c16' }}><CalendarOutlined /></div>
          </div>
        </Card>
      </div>

      <Button type="dashed" icon={<PlusOutlined />} onClick={addDay} block style={{ marginBottom: 16, height: 44, fontSize: 15 }}>
        Thêm ngày mới
      </Button>

      <DragDropContext onDragEnd={handleDragEnd}>
        {itinerary.days.map((day) => (
          <ItineraryDayCard
            key={day.id}
            day={day}
            getDestById={getDestById}
            travelTime={travelTimeByDay[day.id] || 0}
            onRemoveDay={removeDay}
            onRemoveItem={removeItem}
            onAddDest={(dayId) => setPickerDay(dayId)}
            itemCount={day.items.length}
          />
        ))}
      </DragDropContext>

      {itinerary.days.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 40, borderRadius: 12 }}>
          <CalendarOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
          <br />
          <Text type="secondary">Chưa có ngày nào. Nhấn "Thêm ngày mới" để bắt đầu lập kế hoạch!</Text>
        </Card>
      )}

      <Modal
        title="Chọn điểm đến"
        visible={!!pickerDay}
        onCancel={() => setPickerDay(null)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {allDestinations.map((dest) => (
            <Col xs={24} sm={12} md={8} key={dest.id}>
              <DestinationCard destination={dest} onAdd={handlePickDest} compact />
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};


export const BudgetPage: React.FC = () => {
  const { threshold, alerts, spendByCategory, totalSpend, saveBudget } = useBudget();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const remaining = threshold.total - totalSpend;

  const handleSave = async (values: any) => {
    await saveBudget({
      total: values.total,
      food: values.food || undefined,
      stay: values.stay || undefined,
      transport: values.transport || undefined,
    });
    setEditing(false);
    message.success('Đã cập nhật ngưỡng ngân sách!');
  };

  const openEdit = () => {
    form.setFieldsValue(threshold);
    setEditing(true);
  };

  return (
    <div>
      <Row gutter={[20, 20]} className="budget-summary">
        <Col xs={24} sm={8}>
          <Card className="stat-card" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <div className="stat-card-inner">
              <Statistic title={<Text strong>Tổng ngân sách</Text>} value={threshold.total} formatter={(v) => formatVND(Number(v))} valueStyle={{ color: '#1890ff', fontWeight: 700 }} />
              <div className="stat-card-icon" style={{ color: '#1890ff' }}><DollarOutlined /></div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className={`stat-card ${totalSpend > threshold.total ? 'budget-exceeded' : ''}`}
            style={{ background: totalSpend > threshold.total ? '#fff1f0' : '#fff7e6', borderColor: totalSpend > threshold.total ? '#ffa39e' : '#ffd591' }}
          >
            <div className="stat-card-inner">
              <Statistic title={<Text strong>Đã chi</Text>} value={totalSpend} formatter={(v) => formatVND(Number(v))} valueStyle={{ color: totalSpend > threshold.total ? '#ff4d4f' : '#fa8c16', fontWeight: 700 }} />
              <div className="stat-card-icon" style={{ color: totalSpend > threshold.total ? '#ff4d4f' : '#fa8c16' }}>
                {totalSpend > threshold.total ? <ExclamationCircleOutlined /> : <DollarOutlined />}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card" style={{ background: remaining >= 0 ? '#f6ffed' : '#fff1f0', borderColor: remaining >= 0 ? '#b7eb8f' : '#ffa39e' }}>
            <div className="stat-card-inner">
              <Statistic title={<Text strong>Còn lại</Text>} value={Math.abs(remaining)} formatter={(v) => `${remaining < 0 ? '-' : ''}${formatVND(Number(v))}`} valueStyle={{ color: remaining >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 700 }} />
              <div className="stat-card-icon" style={{ color: remaining >= 0 ? '#52c41a' : '#ff4d4f' }}><DollarOutlined /></div>
            </div>
          </Card>
        </Col>
      </Row>

      {alerts.map((a) => (
        <Alert
          key={a.category}
          type={a.level === 'exceeded' ? 'error' : 'warning'}
          showIcon
          closable
          style={{ marginBottom: 12, borderRadius: 8 }}
          message={
            a.level === 'exceeded'
              ? `${CATEGORY_LABELS[a.category]}: Đã vượt ngưỡng! (${a.percent.toFixed(0)}%)`
              : `${CATEGORY_LABELS[a.category]}: Sắp đạt ngưỡng (${a.percent.toFixed(0)}%)`
          }
          description={`Đã chi: ${formatVND(a.spent)} / Ngưỡng: ${formatVND(a.limit)}`}
        />
      ))}

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" ghost onClick={openEdit} icon={<EditOutlined />}>
          Chỉnh sửa ngưỡng ngân sách
        </Button>
      </div>

      <BudgetChart spend={spendByCategory} threshold={threshold} />

      <Modal
        title="Chỉnh sửa ngưỡng ngân sách"
        visible={editing}
        onCancel={() => setEditing(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="total"
            label="Tổng ngân sách (VND)"
            rules={[{ required: true, message: 'Nhập tổng ngân sách' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={500000}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v!.replace(/,/g, '')) as any}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="food" label="Ăn uống">
                <InputNumber style={{ width: '100%' }} min={0} step={100000} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stay" label="Lưu trú">
                <InputNumber style={{ width: '100%' }} min={0} step={100000} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transport" label="Di chuyển">
                <InputNumber style={{ width: '100%' }} min={0} step={100000} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};


export const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, username } = useAppSelector((s) => s.admin);
  const { allDestinations, create, update, remove } = useDestinations();
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loginForm] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleLogin = (values: { username: string; password: string }) => {
    if (
      values.username === ADMIN_CREDENTIALS.username &&
      values.password === ADMIN_CREDENTIALS.password
    ) {
      dispatch(adminActions.login(values.username));
      message.success('Đăng nhập thành công!');
    } else {
      message.error('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  const handleLogout = () => dispatch(adminActions.logout());

  const openCreate = () => {
    setEditingDest(null);
    setImagePreview('');
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (dest: Destination) => {
    setEditingDest(dest);
    setImagePreview(dest.imageUrl);
    form.setFieldsValue({
      ...dest,
      food: dest.costBreakdown.food,
      stay: dest.costBreakdown.stay,
      transport: dest.costBreakdown.transport,
      tags: dest.tags?.join(', '),
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    const dest: Destination = {
      id: editingDest?.id || genId(),
      title: values.title,
      description: values.description || '',
      imageUrl: imagePreview || values.imageUrl || 'https://placehold.co/400x260/ccc/666?text=No+Image',
      location: values.location,
      rating: values.rating,
      type: values.type,
      visitDuration: values.visitDuration,
      costBreakdown: { food: values.food, stay: values.stay, transport: values.transport },
      tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };
    if (editingDest) {
      await update(dest);
      message.success('Đã cập nhật điểm đến!');
    } else {
      await create(dest);
      message.success('Đã thêm điểm đến mới!');
    }
    setModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    message.success('Đã xóa điểm đến!');
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImagePreview(url);
      form.setFieldsValue({ imageUrl: url });
    };
    reader.readAsDataURL(file);
    return false;
  };

  
  const monthlyData = useMemo(() => {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    return months.map((m) => ({ month: m, value: Math.floor(Math.random() * 30) + 5 }));
  }, []);

  const popularData = useMemo(() => {
    return allDestinations
      .slice(0, 6)
      .map((d) => ({ name: d.title, value: Math.floor(Math.random() * 50) + 10 }))
      .sort((a, b) => b.value - a.value);
  }, [allDestinations]);

  const revenueData = useMemo(() => {
    return [
      { type: CATEGORY_LABELS.food, value: allDestinations.reduce((s, d) => s + d.costBreakdown.food, 0) },
      { type: CATEGORY_LABELS.stay, value: allDestinations.reduce((s, d) => s + d.costBreakdown.stay, 0) },
      { type: CATEGORY_LABELS.transport, value: allDestinations.reduce((s, d) => s + d.costBreakdown.transport, 0) },
    ];
  }, [allDestinations]);

  
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <Card className="admin-login-card" title={<span>🔐 Đăng nhập Quản trị</span>}>
          <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
              <Input placeholder="admin" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password placeholder="admin123" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block icon={<LoginOutlined />} size="large">
              Đăng nhập
            </Button>
          </Form>
          <Divider />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo: admin / admin123
          </Text>
        </Card>
      </div>
    );
  }

  
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      width: 80,
      render: (url: string) => (
        <img src={url} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} />
      ),
    },
    { title: 'Tên', dataIndex: 'title', ellipsis: true },
    { title: 'Vị trí', dataIndex: 'location', responsive: ['md'] as any },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (t: DestinationType) => (
        <Tag color={DEST_TYPE_COLORS[t]}>{DEST_TYPE_LABELS[t]}</Tag>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      sorter: (a: Destination, b: Destination) => a.rating - b.rating,
      render: (r: number) => (
        <span><StarFilled style={{ color: '#fadb14', marginRight: 4 }} />{r}</span>
      ),
    },
    {
      title: 'Tổng chi phí',
      render: (_: any, r: Destination) => formatVND(totalCost(r)),
      sorter: (a: Destination, b: Destination) => totalCost(a) - totalCost(b),
      responsive: ['lg'] as any,
    },
    {
      title: 'Hành động',
      width: 120,
      render: (_: any, record: Destination) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xóa điểm đến này?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Space>
            <Text>Xin chào, <Text strong>{username}</Text></Text>
            <Button size="small" icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm điểm đến
          </Button>
        </Col>
      </Row>

      <Tabs defaultActiveKey="list" type="card">
        <TabPane tab={<span><UnorderedListOutlined /> Điểm đến ({allDestinations.length})</span>} key="list">
          <Table
            dataSource={allDestinations}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 600 }}
            style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}
          />
        </TabPane>
        <TabPane tab={<span><BarChartOutlined /> Thống kê</span>} key="stats">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card className="section-card" title="Số lịch trình theo tháng">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <ReTooltip />
                    <ReLine type="monotone" dataKey="value" stroke="#1890ff" strokeWidth={2} dot={{ r: 4 }} name="Lịch trình" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="section-card" title="Điểm đến phổ biến">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={popularData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <ReTooltip />
                    <Bar dataKey="value" fill="#fa8c16" radius={[4, 4, 0, 0]} name="Lượt chọn" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="section-card" title="Doanh thu theo danh mục">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={revenueData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" nameKey="type" label={({ type, percent }: any) => `${type} ${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#1890ff" />
                      <Cell fill="#52c41a" />
                      <Cell fill="#fa8c16" />
                    </Pie>
                    <ReTooltip formatter={(v: any) => formatVND(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {}
      <Modal
        title={editingDest ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingDest ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Vị trí" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                <Select options={[
                  { label: '🏖️ Biển', value: 'beach' },
                  { label: '⛰️ Núi', value: 'mountain' },
                  { label: '🏙️ Thành phố', value: 'city' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visitDuration" label="Thời gian (giờ)" rules={[{ required: true }]}>
                <InputNumber min={1} max={24} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider>Chi phí (VND)</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="food" label="Ăn uống" rules={[{ required: true }]}>
                <InputNumber min={0} step={50000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stay" label="Lưu trú" rules={[{ required: true }]}>
                <InputNumber min={0} step={50000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transport" label="Di chuyển" rules={[{ required: true }]}>
                <InputNumber min={0} step={50000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider>Hình ảnh</Divider>
          <div className="dest-form-upload">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUpload as any}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên (Base64)</Button>
              </Upload>
              <Form.Item name="imageUrl" label={<span><LinkOutlined /> Hoặc nhập URL ảnh</span>} style={{ margin: 0 }}>
                <Input
                  placeholder="https://..."
                  onChange={(e) => setImagePreview(e.target.value)}
                />
              </Form.Item>
              {imagePreview && <img src={imagePreview} alt="preview" className="dest-form-upload-preview" />}
            </Space>
          </div>
          <Form.Item name="tags" label="Tags (phân cách bởi dấu phẩy)" style={{ marginTop: 16 }}>
            <Input placeholder="biển, resort, gia đình" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
