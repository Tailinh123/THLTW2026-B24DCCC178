import React, { useState, useRef } from 'react';
import {
  Button, Input, Popconfirm, Space, Table, Tag, Tooltip, Modal,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import moment from 'moment';
import type { CauLacBo, DonDangKy } from '../types';
import ClubFormModal from './ClubFormModal';

interface Props {
  clubs: CauLacBo[];
  memberships: DonDangKy[];
  onAdd: (data: Omit<CauLacBo, 'id'>) => void;
  onEdit: (id: string, data: Partial<CauLacBo>) => void;
  onDelete: (id: string) => void;
}

const ClubListPage: React.FC<Props> = ({ clubs, memberships, onAdd, onEdit, onDelete }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<CauLacBo | null>(null);
  const [membersModal, setMembersModal] = useState<{ open: boolean; club: CauLacBo | null }>({ open: false, club: null });
  const searchInput = useRef<any>(null);

  const getColumnSearch = (dataIndex: keyof CauLacBo): ColumnType<CauLacBo> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">
            Tìm
          </Button>
          <Button onClick={() => { clearFilters?.(); confirm(); }} size="small">
            Xóa lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100);
    },
  });

  const handleAdd = () => {
    setEditRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: CauLacBo) => {
    setEditRecord(record);
    setFormOpen(true);
  };

  const handleSubmit = (data: Omit<CauLacBo, 'id'>) => {
    if (editRecord) {
      onEdit(editRecord.id, data);
    } else {
      onAdd(data);
    }
    setFormOpen(false);
  };

  const columns: ColumnType<CauLacBo>[] = [
    {
      title: 'Ảnh',
      dataIndex: 'anhDaiDien',
      width: 72,
      render: (src: string, r: CauLacBo) => (
        <img
          src={src}
          alt={r.tenCLB}
          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }}
        />
      ),
    },
    {
      title: 'Tên CLB',
      dataIndex: 'tenCLB',
      sorter: (a, b) => a.tenCLB.localeCompare(b.tenCLB),
      ...getColumnSearch('tenCLB'),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'ngayThanhLap',
      sorter: (a, b) => a.ngayThanhLap.localeCompare(b.ngayThanhLap),
      render: (v: string) => moment(v).format('DD/MM/YYYY'),
      width: 148,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'chuNhiem',
      ...getColumnSearch('chuNhiem'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      render: (html: string) => (
        <div
          style={{ maxWidth: 260, maxHeight: 44, overflow: 'hidden', fontSize: 13, color: '#555' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'hoatDong',
      width: 110,
      filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }],
      onFilter: (v, r) => r.hoatDong === v,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'error'}>{v ? 'Có' : 'Không'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 160,
      render: (_: any, record: CauLacBo) => (
        <Space>
          <Tooltip title="Xem thành viên">
            <Button
              icon={<UserOutlined />}
              size="small"
              onClick={() => setMembersModal({ open: true, club: record })}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              ghost
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa câu lạc bộ này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const clubMembers = membersModal.club
    ? memberships.filter((m) => m.clubId === membersModal.club!.id && m.trangThai === 'Approved')
    : [];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm CLB
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={clubs}
        bordered
        pagination={{ pageSize: 8, showSizeChanger: true }}
        style={{ borderRadius: 8 }}
      />

      <ClubFormModal
        open={formOpen}
        editRecord={editRecord}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <Modal
        visible={membersModal.open}
        title={`Thành viên: ${membersModal.club?.tenCLB}`}
        onCancel={() => setMembersModal({ open: false, club: null })}
        footer={null}
        width={700}
      >
        <Table
          rowKey="id"
          size="small"
          dataSource={clubMembers}
          pagination={false}
          columns={[
            { title: 'Họ tên', dataIndex: 'hoTen' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'SĐT', dataIndex: 'sdt' },
            { title: 'Sở trường', dataIndex: 'soTruong' },
            {
              title: 'Ngày ĐK',
              dataIndex: 'ngayDangKy',
              render: (v: string) => moment(v).format('DD/MM/YYYY'),
            },
          ]}
          locale={{ emptyText: 'Chưa có thành viên được duyệt' }}
        />
      </Modal>
    </>
  );
};

export default ClubListPage;
