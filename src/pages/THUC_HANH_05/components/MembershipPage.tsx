import React, { useState, useRef } from 'react';
import {
  Button, Input, Popconfirm, Space, Table, Tag, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  CheckOutlined, CloseOutlined, HistoryOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import moment from 'moment';
import type { CauLacBo, DonDangKy, LichSuThaoTac } from '../types';
import MembershipFormModal from './MembershipFormModal';
import MembershipDetailModal from './MembershipDetailModal';
import ApproveRejectModal from './ApproveRejectModal';
import HistoryModal from './HistoryModal';

interface Props {
  memberships: DonDangKy[];
  clubs: CauLacBo[];
  history: LichSuThaoTac[];
  onAdd: (data: Omit<DonDangKy, 'id'>) => void;
  onEdit: (id: string, data: Partial<DonDangKy>) => void;
  onDelete: (id: string) => void;
  onApprove: (ids: string[]) => void;
  onReject: (ids: string[], lyDo: string) => void;
}

const STATUS_COLOR: Record<string, string> = {
  Pending: 'orange',
  Approved: 'success',
  Rejected: 'error',
};
const STATUS_LABEL: Record<string, string> = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
};

const MembershipPage: React.FC<Props> = ({
  memberships, clubs, history, onAdd, onEdit, onDelete, onApprove, onReject,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DonDangKy | null>(null);
  const [detailRecord, setDetailRecord] = useState<DonDangKy | null>(null);
  const [approveModal, setApproveModal] = useState<{ open: boolean; mode: 'approve' | 'reject'; ids: string[] }>({ open: false, mode: 'approve', ids: [] });
  const [historyOpen, setHistoryOpen] = useState(false);
  const searchInput = useRef<any>(null);

  const getColumnSearch = (dataIndex: keyof DonDangKy): ColumnType<DonDangKy> => ({
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
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">Tìm</Button>
          <Button onClick={() => { clearFilters?.(); confirm(); }} size="small">Xóa</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100);
    },
  });

  const handleSubmit = (data: Omit<DonDangKy, 'id'>) => {
    if (editRecord) {
      onEdit(editRecord.id, data);
    } else {
      onAdd(data);
    }
    setFormOpen(false);
  };

  const openApprove = (ids: string[], mode: 'approve' | 'reject') => {
    setApproveModal({ open: true, mode, ids });
  };

  const handleApproveConfirm = (lyDo: string) => {
    if (approveModal.mode === 'approve') {
      onApprove(approveModal.ids);
    } else {
      onReject(approveModal.ids, lyDo);
    }
    setApproveModal({ open: false, mode: 'approve', ids: [] });
    setSelectedRowKeys([]);
  };

  const columns: ColumnType<DonDangKy>[] = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
      ...getColumnSearch('hoTen'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearch('email'),
    },
    {
      title: 'SĐT',
      dataIndex: 'sdt',
      width: 120,
    },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      filters: clubs.map((c) => ({ text: c.tenCLB, value: c.id })),
      onFilter: (v, r) => r.clubId === v,
      render: (id: string) => clubs.find((c) => c.id === id)?.tenCLB ?? id,
    },
    {
      title: 'Ngày ĐK',
      dataIndex: 'ngayDangKy',
      sorter: (a, b) => a.ngayDangKy.localeCompare(b.ngayDangKy),
      render: (v: string) => moment(v).format('DD/MM/YYYY'),
      width: 110,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 120,
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Từ chối', value: 'Rejected' },
      ],
      onFilter: (v, r) => r.trangThai === v,
      render: (v: string) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v]}</Tag>,
    },
    {
      title: 'Thao tác',
      width: 180,
      render: (_: any, record: DonDangKy) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" onClick={() => setDetailRecord(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" type="primary" ghost
              onClick={() => { setEditRecord(record); setFormOpen(true); }} />
          </Tooltip>
          <Tooltip title="Duyệt">
            <Button icon={<CheckOutlined />} size="small" style={{ color: '#52c41a', borderColor: '#52c41a' }}
              disabled={record.trangThai === 'Approved'}
              onClick={() => openApprove([record.id], 'approve')} />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button icon={<CloseOutlined />} size="small" danger
              disabled={record.trangThai === 'Rejected'}
              onClick={() => openApprove([record.id], 'reject')} />
          </Tooltip>
          <Popconfirm title="Xóa đơn này?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const selectedPending = (selectedRowKeys as string[]).filter(
    (key) => memberships.find((m) => m.id === key)?.trangThai === 'Pending',
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <Space>
          {selectedRowKeys.length > 0 && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                disabled={selectedPending.length === 0}
                onClick={() => openApprove(selectedPending, 'approve')}
              >
                Duyệt ({selectedPending.length})
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                disabled={selectedPending.length === 0}
                onClick={() => openApprove(selectedPending, 'reject')}
              >
                Từ chối ({selectedPending.length})
              </Button>
            </>
          )}
          <Button icon={<HistoryOutlined />} onClick={() => setHistoryOpen(true)}>
            Lịch sử
          </Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditRecord(null); setFormOpen(true); }}>
          Thêm đơn
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={memberships}
        bordered
        pagination={{ pageSize: 8, showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        style={{ borderRadius: 8 }}
      />

      <MembershipFormModal
        open={formOpen}
        editRecord={editRecord}
        clubs={clubs}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <MembershipDetailModal
        open={!!detailRecord}
        record={detailRecord}
        clubs={clubs}
        onCancel={() => setDetailRecord(null)}
      />
      <ApproveRejectModal
        open={approveModal.open}
        mode={approveModal.mode}
        count={approveModal.ids.length}
        onCancel={() => setApproveModal({ open: false, mode: 'approve', ids: [] })}
        onConfirm={handleApproveConfirm}
      />
      <HistoryModal
        open={historyOpen}
        history={history}
        onCancel={() => setHistoryOpen(false)}
      />
    </>
  );
};

export default MembershipPage;
