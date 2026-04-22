import React, { useState, useCallback } from 'react';
import { Layout, notification, Row, Col } from 'antd';
import { useTheme } from '../../hooks/useTheme';
import { useRooms } from '../../hooks/useRooms';
import { useFilters } from '../../hooks/useFilters';
import { Room, RoomType, DrawerMode } from '../../types/room';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import StatCards from '../dashboard/StatCards';
import RoomTypeChart from '../dashboard/RoomTypeChart';
import RoomFilters from '../room/RoomFilters';
import RoomTable from '../room/RoomTable';
import RoomDrawer from '../room/RoomDrawer';
import ColumnToggle from '../room/ColumnToggle';
import EmptyState from '../room/EmptyState';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const { themeClass } = useTheme();
  const {
    rooms,
    loading,
    highlightedId,
    addRoom,
    updateRoom,
    deleteRoom,
    resetToDefaults,
    clearHighlight,
  } = useRooms();

  const {
    search,
    debouncedSearch,
    typeFilter,
    managerFilter,
    sortField,
    sortOrder,
    pagination,
    visibleColumns,
    filteredRooms,
    hasActiveFilters,
    setSearch,
    setTypeFilter,
    setManagerFilter,
    setSort,
    setPagination,
    setVisibleColumns,
    clearAllFilters,
  } = useFilters(rooms);

<<<<<<< HEAD
  
=======
>>>>>>> c7699e0 (THUC_HANH_07)
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('add');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

<<<<<<< HEAD
  
=======
>>>>>>> c7699e0 (THUC_HANH_07)
  const [collapsed, setCollapsed] = useState(false);

  const handleOpenAddDrawer = useCallback(() => {
    setDrawerMode('add');
    setEditingRoom(null);
    setDrawerVisible(true);
  }, []);

  const handleOpenEditDrawer = useCallback((room: Room) => {
    setDrawerMode('edit');
    setEditingRoom(room);
    setDrawerVisible(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
    setEditingRoom(null);
  }, []);

  const handleSubmitRoom = useCallback(
    (room: Room) => {
      if (drawerMode === 'add') {
        addRoom(room);
        notification.success({
          message: 'Thêm phòng thành công',
          description: `Phòng "${room.name}" đã được thêm vào hệ thống.`,
          placement: 'topRight',
          duration: 3,
        });
      } else {
        updateRoom(room);
        notification.success({
          message: 'Cập nhật thành công',
          description: `Phòng "${room.name}" đã được cập nhật.`,
          placement: 'topRight',
          duration: 3,
        });
      }
      handleCloseDrawer();
    },
    [drawerMode, addRoom, updateRoom, handleCloseDrawer],
  );

  const handleDeleteRoom = useCallback(
    (id: string) => {
      const room = rooms.find((r) => r.id === id);
      deleteRoom(id);
      notification.success({
        message: 'Xóa thành công',
        description: `Phòng "${room?.name || id}" đã được xóa khỏi hệ thống.`,
        placement: 'topRight',
        duration: 3,
      });
    },
    [rooms, deleteRoom],
  );

<<<<<<< HEAD
  
  const handleFilterByType = useCallback(
    (type: RoomType) => {
      
=======
  const handleFilterByType = useCallback(
    (type: RoomType) => {
>>>>>>> c7699e0 (THUC_HANH_07)
      if (typeFilter === type) {
        setTypeFilter(null);
        notification.info({
          message: 'Đã xóa bộ lọc',
          description: 'Hiển thị tất cả loại phòng.',
          placement: 'topRight',
          duration: 2,
        });
      } else {
        setTypeFilter(type);
        notification.info({
          message: 'Đã lọc theo loại phòng',
          description: `Đang hiển thị phòng loại "${type === RoomType.THEORY ? 'Lý thuyết' : type === RoomType.PRACTICE ? 'Thực hành' : 'Hội trường'}".`,
          placement: 'topRight',
          duration: 2,
        });
      }
    },
    [typeFilter, setTypeFilter],
  );

  const isEmpty = rooms.length === 0;

  return (
    <div className={`giua-ki-root ${themeClass}`}>
      <Layout style={{ minHeight: '100vh' }}>
        <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />

        <Layout className={`gk-main-layout ${collapsed ? 'gk-main-layout--collapsed' : ''}`}>
          <AppHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />

          <Content className="gk-content">
            {}
            <div className="gk-dashboard">
              <StatCards rooms={rooms} onFilterByType={handleFilterByType} />

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <RoomTypeChart rooms={rooms} onFilterByType={handleFilterByType} />
                </Col>
                <Col xs={24} lg={12}>
                  <div className="gk-chart-card">
                    <div className="gk-chart-card__title">Thông tin nhanh</div>
                    <div style={{ padding: '16px 0' }}>
                      <Row gutter={[8, 16]}>
                        <Col span={12}>
                          <div className="gk-quick-stat">
                            <div className="gk-quick-stat__label">Phòng nhỏ</div>
                            <div className="gk-quick-stat__value gk-quick-stat__value--success">
                              {rooms.filter((r) => r.capacity < 30).length}
                            </div>
                            <div className="gk-quick-stat__hint">Sức chứa &lt; 30</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="gk-quick-stat">
                            <div className="gk-quick-stat__label">Phòng lớn</div>
                            <div className="gk-quick-stat__value gk-quick-stat__value--warning">
                              {rooms.filter((r) => r.capacity >= 30).length}
                            </div>
                            <div className="gk-quick-stat__hint">Sức chứa ≥ 30</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="gk-quick-stat">
                            <div className="gk-quick-stat__label">Sức chứa trung bình</div>
                            <div className="gk-quick-stat__value">
                              {rooms.length > 0
                                ? Math.round(
                                  rooms.reduce((s, r) => s + r.capacity, 0) / rooms.length,
                                )
                                : 0}
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="gk-quick-stat">
                            <div className="gk-quick-stat__label">Giảng viên quản lý</div>
                            <div className="gk-quick-stat__value">
                              {new Set(rooms.map((r) => r.manager)).size}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {}
            <div className="gk-table-card">
              {isEmpty ? (
                <EmptyState
                  onAddRoom={handleOpenAddDrawer}
                  onLoadDefaults={resetToDefaults}
                />
              ) : (
                <>
                  {}
                  <RoomFilters
                    search={search}
                    typeFilter={typeFilter}
                    managerFilter={managerFilter}
                    hasActiveFilters={hasActiveFilters}
                    onSearchChange={setSearch}
                    onTypeFilterChange={setTypeFilter}
                    onManagerFilterChange={setManagerFilter}
                    onClearFilters={clearAllFilters}
                    onAddRoom={handleOpenAddDrawer}
                  />

                  {}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 24px 0',
                  }}>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>
                      {filteredRooms.length} kết quả
                      {hasActiveFilters ? ' (đã lọc)' : ''}
                    </span>
                    <ColumnToggle
                      visibleColumns={visibleColumns}
                      onChange={setVisibleColumns}
                    />
                  </div>

                  <RoomTable
                    rooms={filteredRooms}
                    loading={loading}
                    highlightedId={highlightedId}
                    searchKeyword={debouncedSearch}
                    visibleColumns={visibleColumns}
                    pagination={pagination}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onEdit={handleOpenEditDrawer}
                    onDelete={handleDeleteRoom}
                    onPaginationChange={setPagination}
                    onSortChange={setSort}
                    onClearHighlight={clearHighlight}
                  />
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>

      {}
      <RoomDrawer
        visible={drawerVisible}
        mode={drawerMode}
        editingRoom={editingRoom}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmitRoom}
      />
    </div>
  );
};

export default AppLayout;
