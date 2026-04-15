import React from 'react';
import {
  Card, Tag, Rate, Tooltip, Button, Typography,
} from 'antd';
import {
  EnvironmentOutlined, PlusOutlined,
} from '@ant-design/icons';
import type { Destination } from '../types';
import {
  formatVND, totalCost, DEST_TYPE_LABELS, DEST_TYPE_COLORS,
} from '../types';

const { Text, Title } = Typography;

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
