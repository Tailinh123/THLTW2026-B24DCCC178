import React, { useCallback } from 'react';
import { Row, Col, Tag } from 'antd';
import { DoorOpen, Users, Layers } from 'lucide-react';
import CountUp from 'react-countup';
import { Room, RoomType, ROOM_TYPE_LABELS, ROOM_TYPE_TAG_COLORS } from '../../types/room';

interface StatCardsProps {
  rooms: Room[];
  onFilterByType?: (type: RoomType) => void;
}

const StatCards: React.FC<StatCardsProps> = ({ rooms, onFilterByType }) => {
  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

  const typeCounts = rooms.reduce<Record<RoomType, number>>(
    (acc, room) => {
      acc[room.type] = (acc[room.type] || 0) + 1;
      return acc;
    },
    { [RoomType.THEORY]: 0, [RoomType.PRACTICE]: 0, [RoomType.HALL]: 0 },
  );

  const handleTypeClick = useCallback(
    (type: RoomType) => {
      if (onFilterByType) {
        onFilterByType(type);
      }
    },
    [onFilterByType],
  );

  return (
    <Row gutter={[16, 16]} className="gk-stats-row">
      {}
      <Col xs={24} sm={8}>
        <div className="gk-stat-card">
          <div className="gk-stat-card__icon-wrap gk-stat-card__icon-wrap--primary">
            <DoorOpen size={24} />
          </div>
          <div className="gk-stat-card__content">
            <div className="gk-stat-card__label">Tổng số phòng</div>
            <div className="gk-stat-card__value">
              <CountUp end={totalRooms} duration={1.5} preserveValue />
            </div>
          </div>
        </div>
      </Col>

      {}
      <Col xs={24} sm={8}>
        <div className="gk-stat-card">
          <div className="gk-stat-card__icon-wrap gk-stat-card__icon-wrap--success">
            <Users size={24} />
          </div>
          <div className="gk-stat-card__content">
            <div className="gk-stat-card__label">Tổng sức chứa</div>
            <div className="gk-stat-card__value">
              <CountUp end={totalCapacity} duration={1.5} separator="," preserveValue />
            </div>
          </div>
        </div>
      </Col>

      {}
      <Col xs={24} sm={8}>
        <div className="gk-stat-card">
          <div className="gk-stat-card__icon-wrap gk-stat-card__icon-wrap--warning">
            <Layers size={24} />
          </div>
          <div className="gk-stat-card__content">
            <div className="gk-stat-card__label">Phân loại phòng</div>
            <div className="gk-stat-card__extra">
              {Object.entries(typeCounts).map(([type, count]) => (
                <Tag
                  key={type}
                  color={ROOM_TYPE_TAG_COLORS[type as RoomType]}
                  className="gk-room-tag gk-room-tag--clickable"
                  onClick={() => handleTypeClick(type as RoomType)}
                  style={{ cursor: 'pointer' }}
                >
                  {ROOM_TYPE_LABELS[type as RoomType]}: {count}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default React.memo(StatCards);
