import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Tag, Typography, Tooltip, Badge, Button, Avatar } from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  DragOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { Task, Status, KanbanColumn } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG, isOverdue } from '../types';

const { Text } = Typography;

interface KanbanBoardTabProps {
  tasks: Task[];
  onReorder: (reorderedTasks: Task[]) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (status: Status) => void;
}

const COLUMNS: { id: Status; title: string }[] = [
  { id: 'TODO', title: 'Cần làm' },
  { id: 'IN_PROGRESS', title: 'Đang làm' },
  { id: 'DONE', title: 'Hoàn thành' },
];

const KanbanBoardTab: React.FC<KanbanBoardTabProps> = ({ tasks, onReorder, onEditTask, onAddTask }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const getColumnTasks = (status: Status): Task[] =>
    tasks.filter((t) => t.status === status);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as Status;
    const destStatus = destination.droppableId as Status;

    const allByColumn: Record<Status, Task[]> = {
      TODO: getColumnTasks('TODO'),
      IN_PROGRESS: getColumnTasks('IN_PROGRESS'),
      DONE: getColumnTasks('DONE'),
    };

    const [movedTask] = allByColumn[sourceStatus].splice(source.index, 1);
    const updatedTask: Task = { ...movedTask, status: destStatus };
    allByColumn[destStatus].splice(destination.index, 0, updatedTask);

    const reordered: Task[] = [
      ...allByColumn.TODO,
      ...allByColumn.IN_PROGRESS,
      ...allByColumn.DONE,
    ];

    onReorder(reordered);
  };

  if (!enabled) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div className="kanban-column" key={col.id}>
              <div className="kanban-column-header">
                <div className="kanban-column-title-wrap">
                  <span className="kanban-column-dot" style={{ background: STATUS_CONFIG[col.id].color }} />
                  <span className="kanban-column-title">{col.title}</span>
                  <Badge
                    count={colTasks.length}
                    style={{
                      backgroundColor: STATUS_CONFIG[col.id].color,
                      fontSize: 11,
                      fontWeight: 600,
                      boxShadow: 'none',
                    }}
                  />
                </div>
                <Tooltip title={`Thêm task "${col.title}"`}>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => onAddTask(col.id)}
                    className="kanban-add-btn"
                  />
                </Tooltip>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column-body ${snapshot.isDraggingOver ? 'kanban-column-body--over' : ''}`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => {
                          const overdue = isOverdue(task.deadline, task.status);
                          return (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`kanban-task-card ${dragSnapshot.isDragging ? 'kanban-task-card--dragging' : ''} ${overdue ? 'kanban-task-card--overdue' : ''}`}
                              style={{
                                ...dragProvided.draggableProps.style,
                                borderLeft: `4px solid ${PRIORITY_CONFIG[task.priority].color}`,
                              }}
                              onClick={() => onEditTask(task)}
                            >
                              <div className="kanban-task-card-top" style={{ justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                                    KAN-{task.id.slice(-4).toUpperCase()}
                                  </Text>
                                  {overdue && (
                                    <Tag color="error" className="kanban-priority-tag" style={{ marginLeft: 4 }}>
                                      <ClockCircleOutlined style={{ marginRight: 3 }} />
                                      Quá hạn
                                    </Tag>
                                  )}
                                </div>
                                <DragOutlined className="kanban-drag-icon" />
                              </div>

                              <Text strong className="kanban-task-title">
                                {task.title}
                              </Text>

                              {task.description && (
                                <Text className="kanban-task-desc">
                                  {task.description.length > 72
                                    ? `${task.description.slice(0, 72)}...`
                                    : task.description}
                                </Text>
                              )}

                              <div className="kanban-task-tags">
                                {task.tags.map((tag) => (
                                  <Tag key={tag} className="kanban-tag-chip">{tag}</Tag>
                                ))}
                              </div>

                              <div className="kanban-task-footer">
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                  <Tooltip title={PRIORITY_CONFIG[task.priority].label}>
                                    <div style={{
                                      width: 8, height: 8, borderRadius: '50%',
                                      backgroundColor: PRIORITY_CONFIG[task.priority].color,
                                      boxShadow: `0 0 0 2px ${PRIORITY_CONFIG[task.priority].color}33`
                                    }} />
                                  </Tooltip>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: overdue ? '#ef4444' : '#94a3b8' }}>
                                    <CalendarOutlined style={{ fontSize: 12 }} />
                                    <Text style={{ fontSize: 12, color: 'inherit' }}>
                                      {moment(task.deadline).format('DD/MM')}
                                    </Text>
                                  </div>
                                </div>
                                <Avatar 
                                  size={24} 
                                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.id}`} 
                                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                />
                              </div>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoardTab;
