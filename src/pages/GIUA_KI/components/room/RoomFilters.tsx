

import React from 'react';
import { Input, Select, Button, Tag } from 'antd';
import { Search, Plus, X } from 'lucide-react';
import { RoomType, ROOM_TYPE_LABELS } from '../../types/room';
import { LECTURERS } from '../../constants';

const { Option } = Select;

interface RoomFiltersProps {
  search: string;
  typeFilter: RoomType | null;
  managerFilter: string | null;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: RoomType | null) => void;
  onManagerFilterChange: (value: string | null) => void;
  onClearFilters: () => void;
  onAddRoom: () => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  search,
  typeFilter,
  managerFilter,
  hasActiveFilters,
  onSearchChange,
  onTypeFilterChange,
  onManagerFilterChange,
  onClearFilters,
  onAddRoom,
}) => {
  return (
    <>
      <div className="gk-table-toolbar">
        <div className="gk-table-toolbar__left">
          {/* Search */}
          <div className="gk-search-input">
            <Input
              prefix={<Search size={15} style={{ color: '#94A3B8' }} />}
              placeholder="Tìm kiếm phòng..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              style={{ width: 240 }}
              aria-label="Tìm kiếm phòng học"
            />
          </div>

          {/* Type Filter */}
          <Select
            className="gk-filter-select"
            placeholder="Loại phòng"
            value={typeFilter}
            onChange={(val) => onTypeFilterChange(val || null)}
            allowClear
            style={{ width: 160 }}
            aria-label="Lọc theo loại phòng"
          >
            {Object.values(RoomType).map((type) => (
              <Option key={type} value={type}>
                {ROOM_TYPE_LABELS[type]}
              </Option>
            ))}
          </Select>

          {/* Manager Filter */}
          <Select
            className="gk-filter-select"
            placeholder="Người quản lý"
            value={managerFilter}
            onChange={(val) => onManagerFilterChange(val || null)}
            allowClear
            showSearch
            optionFilterProp="children"
            style={{ width: 200 }}
            aria-label="Lọc theo người quản lý"
          >
            {LECTURERS.map((lecturer) => (
              <Option key={lecturer} value={lecturer}>
                {lecturer}
              </Option>
            ))}
          </Select>
        </div>

        <div className="gk-table-toolbar__right">
          <Button
            type="primary"
            className="gk-btn-primary"
            icon={<Plus size={16} />}
            onClick={onAddRoom}
            aria-label="Thêm phòng mới"
          >
            Thêm phòng
          </Button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="gk-filter-tags">
          {search && (
            <Tag
              className="gk-filter-tag"
              closable
              onClose={() => onSearchChange('')}
            >
              Tìm: "{search}"
            </Tag>
          )}
          {typeFilter && (
            <Tag
              className="gk-filter-tag"
              closable
              onClose={() => onTypeFilterChange(null)}
            >
              Loại: {ROOM_TYPE_LABELS[typeFilter]}
            </Tag>
          )}
          {managerFilter && (
            <Tag
              className="gk-filter-tag"
              closable
              onClose={() => onManagerFilterChange(null)}
            >
              QL: {managerFilter}
            </Tag>
          )}
          <Button
            type="text"
            className="gk-clear-filters-btn"
            onClick={onClearFilters}
            icon={<X size={12} />}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </>
  );
};

export default React.memo(RoomFilters);
