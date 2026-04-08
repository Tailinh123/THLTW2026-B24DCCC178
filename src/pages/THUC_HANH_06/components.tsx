import React, { useMemo } from 'react';
import {
  Card, Tag, Rate, Row, Col, Checkbox, Slider, Select, Typography, Button, Space, Tooltip,
} from 'antd';
import {
  EnvironmentOutlined, PlusOutlined, DeleteOutlined, MenuOutlined,
} from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { Destination, DestinationType, FilterOptions, BudgetThreshold } from './types';
import {
  formatVND, totalCost, DEST_TYPE_LABELS, DEST_TYPE_COLORS, CATEGORY_LABELS, MAX_PER_DAY,
} from './types';

const { Text, Title } = Typography;

const PIE_COLORS = ['#1890ff', '#52c41a', '#fa8c16'];

/* ===================================================================
   1. DestinationCard
   =================================================================== */
interface DestCardProps {
  destination: Destination;
  onAdd?: (id: string) => void;
  compact?: boolean;
}

export const DestinationCard: React.FC<DestCardProps> = ({ destination, onAdd, compact }) => {
  const cost = totalCost(destination);
  return (
    <Card
      className="dest-card"
      hoverable
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="dest-card-cover-img">
            <img alt={destination.title} src={destination.imageUrl} />
          </div>
          <Tag
            color={DEST_TYPE_COLORS[destination.type]}
            className="dest-card-type"
            style={{ fontWeight: 600, borderRadius: 6 }}
          >
            {DEST_TYPE_LABELS[destination.type]}
          </Tag>
        </div>
      }
      actions={
        onAdd
          ? [
              <Tooltip title="Thêm vào lịch trình" key="add">
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => onAdd(destination.id)}
                  style={{ color: '#1890ff' }}
                >
                  {compact ? '' : 'Thêm vào lịch trình'}
                </Button>
              </Tooltip>,
            ]
          : undefined
      }
    >
      <div className="dest-card-rating">
        <Rate disabled allowHalf value={destination.rating} style={{ fontSize: 14 }} />
        <Text strong style={{ fontSize: 13 }}>
          {destination.rating}
        </Text>
      </div>
      <Title level={5} style={{ margin: 0, fontSize: compact ? 14 : 16 }} ellipsis>
        {destination.title}
      </Title>
      <div className="dest-card-location">
        <EnvironmentOutlined /> {destination.location}
      </div>
      {!compact && (
        <Text type="secondary" style={{ fontSize: 13 }} ellipsis={{ tooltip: true }}>
          {destination.description}
        </Text>
      )}
      <div className="dest-card-cost">
        <Text strong style={{ color: '#1890ff', fontSize: 15 }}>
          {formatVND(cost)}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {destination.visitDuration}h tham quan
        </Text>
      </div>
    </Card>
  );
};

/* ===================================================================
   2. FilterSortBar
   =================================================================== */
interface FilterProps {
  value: Partial<FilterOptions>;
  onChange: (v: Partial<FilterOptions>) => void;
  maxPrice?: number;
}

export const FilterSortBar: React.FC<FilterProps> = ({ value, onChange, maxPrice = 5000000 }) => {
  const typeOptions = [
    { label: '🏖️ Biển', value: 'beach' as DestinationType },
    { label: '⛰️ Núi', value: 'mountain' as DestinationType },
    { label: '🏙️ Thành phố', value: 'city' as DestinationType },
  ];

  return (
    <div className="filter-bar">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Loại hình
          </Text>
          <Checkbox.Group
            options={typeOptions}
            value={value.types}
            onChange={(v) => onChange({ ...value, types: v as DestinationType[] })}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Khoảng giá
          </Text>
          <Slider
            range
            min={0}
            max={maxPrice}
            step={100000}
            value={value.priceRange || [0, maxPrice]}
            onChange={(v) => onChange({ ...value, priceRange: v as [number, number] })}
            tipFormatter={(v) => formatVND(v || 0)}
          />
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Đánh giá tối thiểu
          </Text>
          <Rate
            allowHalf
            value={value.minRating || 0}
            onChange={(v) => onChange({ ...value, minRating: v })}
          />
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Sắp xếp
          </Text>
          <Select
            value={value.sortBy || 'rating'}
            onChange={(v) => onChange({ ...value, sortBy: v })}
            style={{ width: '100%' }}
            options={[
              { label: '⭐ Đánh giá', value: 'rating' },
              { label: '💰 Giá', value: 'price' },
              { label: '🔤 Tên', value: 'name' },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

/* ===================================================================
   3. BudgetChart
   =================================================================== */
interface BudgetChartProps {
  spend: { food: number; stay: number; transport: number };
  threshold: BudgetThreshold;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ spend, threshold }) => {
  const pieData = [
    { name: CATEGORY_LABELS.food, value: spend.food },
    { name: CATEGORY_LABELS.stay, value: spend.stay },
    { name: CATEGORY_LABELS.transport, value: spend.transport },
  ];

  const barData = [
    { category: CATEGORY_LABELS.food, 'Đã chi': spend.food, 'Ngưỡng': threshold.food || 0 },
    { category: CATEGORY_LABELS.stay, 'Đã chi': spend.stay, 'Ngưỡng': threshold.stay || 0 },
    { category: CATEGORY_LABELS.transport, 'Đã chi': spend.transport, 'Ngưỡng': threshold.transport || 0 },
  ];

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card className="section-card" title="Phân bổ chi phí">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <ReTooltip formatter={(v: any) => formatVND(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card className="section-card" title="So sánh với ngưỡng">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <ReTooltip formatter={(v: any) => formatVND(Number(v))} />
              <Legend />
              <Bar dataKey="Đã chi" fill="#fa8c16" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ngưỡng" fill="#91d5ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

/* ===================================================================
   4. ItineraryDayCard
   =================================================================== */
interface DayCardProps {
  day: { id: string; dayNumber: number; items: any[] };
  getDestById: (id: string) => Destination | undefined;
  travelTime: number;
  onRemoveDay: (dayId: string) => void;
  onRemoveItem: (dayId: string, itemId: string) => void;
  onAddDest: (dayId: string) => void;
  itemCount: number;
}

export const ItineraryDayCard: React.FC<DayCardProps> = ({
  day,
  getDestById,
  travelTime,
  onRemoveDay,
  onRemoveItem,
  onAddDest,
  itemCount,
}) => {
  const dayCost = useMemo(() => {
    return day.items.reduce((sum: number, item: any) => {
      const d = getDestById(item.destinationId);
      return d ? sum + totalCost(d) : sum;
    }, 0);
  }, [day.items, getDestById]);

  return (
    <div className="itinerary-day">
      <div className="itinerary-day-header">
        <span>
          📅 Ngày {day.dayNumber} — {day.items.length} điểm đến
          {travelTime > 0 && ` • ~${travelTime}h di chuyển`}
          {' • '}
          {formatVND(dayCost)}
        </span>
        <Space>
          <Button
            size="small"
            ghost
            icon={<PlusOutlined />}
            onClick={() => onAddDest(day.id)}
            disabled={itemCount >= MAX_PER_DAY}
          >
            Thêm
          </Button>
          <Button
            size="small"
            ghost
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemoveDay(day.id)}
          />
        </Space>
      </div>
      <Droppable droppableId={day.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="itinerary-day-body">
            {day.items.length === 0 && (
              <div className="itinerary-day-empty">
                Kéo thả hoặc nhấn "Thêm" để thêm điểm đến
              </div>
            )}
            {day.items.map((item: any, index: number) => {
              const dest = getDestById(item.destinationId);
              if (!dest) return null;
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className="itinerary-item"
                    >
                      <span {...dragProvided.dragHandleProps} className="itinerary-item-drag">
                        <MenuOutlined />
                      </span>
                      <Tag color={DEST_TYPE_COLORS[dest.type]} style={{ borderRadius: 4, margin: 0 }}>
                        {DEST_TYPE_LABELS[dest.type]}
                      </Tag>
                      <div className="itinerary-item-info">
                        <h4>{dest.title}</h4>
                        <span>
                          {dest.location} • {dest.visitDuration}h • {formatVND(totalCost(dest))}
                        </span>
                      </div>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveItem(day.id, item.id)}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
