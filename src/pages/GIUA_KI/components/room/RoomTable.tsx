

import React, { useEffect, useRef, useCallback } from 'react';
import { Table, Tag, Button, Popconfirm, Tooltip, Skeleton } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import Highlighter from 'react-highlight-words';
import { Room, RoomType, ROOM_TYPE_LABELS, ROOM_TYPE_TAG_COLORS } from '../../types/room';
import { CAPACITY_DELETE_THRESHOLD, PAGE_SIZE_OPTIONS } from '../../constants';
import { canDeleteRoom } from '../../utils/helpers';
import CapacityBar from '../common/CapacityBar';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';

interface RoomTableProps {
  rooms: Room[];
  loading: boolean;
  highlightedId: string | null;
  searchKeyword: string;
  visibleColumns: string[];
  pagination: { current: number; pageSize: number };
  sortField: 'capacity' | null;
  sortOrder: 'ascend' | 'descend' | null;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onPaginationChange: (config: Partial<{ current: number; pageSize: number }>) => void;
  onSortChange: (field: 'capacity' | null, order: 'ascend' | 'descend' | null) => void;
  onClearHighlight: () => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  loading,
  highlightedId,
  searchKeyword,
  visibleColumns,
  pagination,
  sortField,
  sortOrder,
  onEdit,
  onDelete,
  onPaginationChange,
  onSortChange,
  onClearHighlight,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Clear highlight after animation
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        onClearHighlight();
      }, 2600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [highlightedId, onClearHighlight]);

  // Auto-scroll to highlighted row
  useEffect(() => {
    if (highlightedId && tableRef.current) {
      setTimeout(() => {
        if (tableRef.current) {
          const row = tableRef.current.querySelector(`[data-row-key="${highlightedId}"]`);
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    }
  }, [highlightedId]);

  const renderHighlight = useCallback(
    (text: string) => (
      <Highlighter
        highlightClassName="gk-search-highlight"
        searchWords={searchKeyword ? [searchKeyword] : []}
        autoEscape
        textToHighlight={text}
      />
    ),
    [searchKeyword],
  );

  const getManagerInitials = (name: string): string => {
    const parts = name.split('.');
    const lastName = parts[parts.length - 1].trim().split(' ');
    if (lastName.length >= 2) {
      return `${lastName[lastName.length - 2][0]}${lastName[lastName.length - 1][0]}`.toUpperCase();
    }
    return lastName[0] ? lastName[0][0].toUpperCase() : '?';
  };

  const allColumns: ColumnsType<Room> = [
    {
      title: 'Mã phòng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <span className="gk-room-id">{renderHighlight(id)}</span>
      ),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a: Room, b: Room) => a.name.localeCompare(b.name, 'vi'),
      render: (name: string) => (
        <span className="gk-room-name">{renderHighlight(name)}</span>
      ),
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: RoomType) => (
        <Tag color={ROOM_TYPE_TAG_COLORS[type]} className="gk-room-tag">
          {ROOM_TYPE_LABELS[type]}
        </Tag>
      ),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 180,
      sorter: true,
      sortOrder: sortField === 'capacity' ? sortOrder : null,
      render: (capacity: number) => <CapacityBar capacity={capacity} />,
    },
    {
      title: 'Người quản lý',
      dataIndex: 'manager',
      key: 'manager',
      width: 220,
      render: (manager: string) => (
        <div className="gk-manager-cell">
          <div className="gk-manager-cell__avatar">
            {getManagerInitials(manager)}
          </div>
          <span className="gk-manager-cell__name">
            {renderHighlight(manager)}
          </span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: Room) => {
        const deletable = canDeleteRoom(record.capacity);
        return (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                className="gk-action-btn gk-action-btn--edit"
                onClick={() => onEdit(record)}
                aria-label={`Chỉnh sửa phòng ${record.name}`}
              >
                <Pencil size={15} />
              </Button>
            </Tooltip>

            {deletable ? (
              <Popconfirm
                title={`Xóa phòng "${record.name}"?`}
                description="Hành động này không thể hoàn tác."
                onConfirm={() => onDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa phòng">
                  <Button
                    type="text"
                    className="gk-action-btn gk-action-btn--delete"
                    aria-label={`Xóa phòng ${record.name}`}
                  >
                    <Trash2 size={15} />
                  </Button>
                </Tooltip>
              </Popconfirm>
            ) : (
              <Tooltip title={`Không thể xóa phòng có sức chứa ≥ ${CAPACITY_DELETE_THRESHOLD}`}>
                <Button
                  type="text"
                  className="gk-action-btn gk-action-btn--disabled"
                  disabled
                  aria-label={`Không thể xóa phòng ${record.name}`}
                >
                  <Trash2 size={15} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // Filter visible columns
  const columns = allColumns.filter((col) =>
    visibleColumns.includes(col.key as string),
  );

  const handleTableChange = (
    pag: TablePaginationConfig,
    _filters: Record<string, (string | number | boolean)[] | null>,
    sorter: SorterResult<Room> | SorterResult<Room>[],
  ) => {
    // Pagination
    if (pag.current && pag.pageSize) {
      onPaginationChange({ current: pag.current, pageSize: pag.pageSize });
    }

    // Sort (for controlled capacity sort)
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (singleSorter?.field === 'capacity') {
      onSortChange(
        singleSorter.order ? 'capacity' : null,
        (singleSorter.order as 'ascend' | 'descend' | null) || null,
      );
    } else if (!singleSorter?.order) {
      onSortChange(null, null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div ref={tableRef} className="gk-table">
      <Table<Room>
        dataSource={rooms}
        columns={columns}
        rowKey="id"
        size="middle"
        onChange={handleTableChange}
        rowClassName={(record) =>
          record.id === highlightedId ? 'gk-row-highlighted' : ''
        }
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: rooms.length,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS.map(String),
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} phòng`,
          size: 'default',
        }}
        locale={{
          emptyText: 'Không tìm thấy phòng nào',
        }}
        aria-label="Bảng quản lý phòng học"
      />
    </div>
  );
};

export default React.memo(RoomTable);
