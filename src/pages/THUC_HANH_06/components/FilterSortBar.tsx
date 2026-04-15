import React from 'react';
import {
  Tag, Rate, Row, Col, Checkbox, Slider, Select, Typography,
} from 'antd';
import type { DestinationType, FilterOptions } from '../types';
import { formatVND } from '../types';

const { Text } = Typography;

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
