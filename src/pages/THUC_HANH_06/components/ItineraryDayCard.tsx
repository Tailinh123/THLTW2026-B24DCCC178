import React, { useMemo } from 'react';
import { Tag, Button, Space } from 'antd';
import {
  PlusOutlined, DeleteOutlined, MenuOutlined,
} from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { Destination } from '../types';
import {
  formatVND, totalCost, DEST_TYPE_LABELS, DEST_TYPE_COLORS, MAX_PER_DAY,
} from '../types';

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
