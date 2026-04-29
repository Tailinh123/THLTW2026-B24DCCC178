import React, { useState, useRef } from 'react';
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip, Modal, Avatar, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
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
        <Input ref={searchInput} placeholder={`Tìm ${dataIndex}`} value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()} style={{ marginBottom: 8, display: 'block' }} />
        <Space>
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small">Tìm</Button>
          <Button onClick={() => { clearFilters?.(); confirm(); }} size="small">Xóa lọc</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#059669' : undefined }} />,
    onFilter: (value, record) => String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => { if (visible) setTimeout(() => searchInput.current?.select(), 100); },
  });

  const handleAdd = () => { setEditRecord(null); setFormOpen(true); };
  const handleEdit = (record: CauLacBo) => { setEditRecord(record); setFormOpen(true); };
  const handleSubmit = (data: Omit<CauLacBo, 'id'>) => {
    editRecord ? onEdit(editRecord.id, data) : onAdd(data);
    setFormOpen(false);
  };

  const columns: ColumnType<CauLacBo>[] = [
    {
      title: 'CLB', dataIndex: 'anhDaiDien', width: 72,
      render: (src: string, r: CauLacBo) => {
        // If it's a placehold.co image from our mock data, just use Avatar with initials instead for a cleaner look
        const isPlaceholder = src && src.includes('placehold.co');
        if (!src || isPlaceholder) {
          const initials = r.tenCLB.replace('CLB ', '').substring(0, 2).toUpperCase();
          const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#059669'];
          const color = colors[r.tenCLB.length % colors.length];
          return <Avatar size={42} style={{ backgroundColor: color, fontWeight: 600, fontSize: 16, borderRadius: 10 }}>{initials}</Avatar>;
        }
        return <img src={src} alt={r.tenCLB} className="clb-avatar-img" style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover' }} />;
      },
    },
    { title: 'Tên CLB', dataIndex: 'tenCLB', sorter: (a, b) => a.tenCLB.localeCompare(b.tenCLB), ...getColumnSearch('tenCLB'),
      render: (t: string) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{t}</span>,
    },
    { title: 'Ngày thành lập', dataIndex: 'ngayThanhLap', sorter: (a, b) => a.ngayThanhLap.localeCompare(b.ngayThanhLap),
      render: (v: string) => moment(v).format('DD/MM/YYYY'), width: 140,
    },
    { title: 'Chủ nhiệm', dataIndex: 'chuNhiem', ...getColumnSearch('chuNhiem'),
      render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    { title: 'Mô tả', dataIndex: 'moTa',
      render: (html: string) => <div style={{ maxWidth: 240, maxHeight: 40, overflow: 'hidden', fontSize: 13, color: '#64748b' }} dangerouslySetInnerHTML={{ __html: html }} />,
    },
    { title: 'Hoạt động', dataIndex: 'hoatDong', width: 100,
      filters: [{ text: 'Có', value: true }, { text: 'Không', value: false }],
      onFilter: (v, r) => r.hoatDong === v,
      render: (v: boolean) => <Tag className="clb-tag-status" color={v ? 'success' : 'error'}>{v ? 'Có' : 'Không'}</Tag>,
    },
    { title: 'Thao tác', width: 100,
      render: (_: any, record: CauLacBo) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm title="Xóa câu lạc bộ này?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy">
                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DeleteOutlined /> Xóa CLB
                </span>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size={8}>
            <Tooltip title="Xem thành viên">
              <Button className="clb-action-btn" type="primary" ghost icon={<UserOutlined />} size="small" onClick={() => setMembersModal({ open: true, club: record })} />
            </Tooltip>
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Button className="clb-action-btn" icon={<MoreOutlined />} size="small" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const clubMembers = membersModal.club ? memberships.filter(m => m.clubId === membersModal.club!.id && m.trangThai === 'Approved') : [];

  return (
    <>
      <div className="clb-toolbar">
        <div />
        <Button type="primary" className="clb-btn-primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm CLB</Button>
      </div>

      <div className="clb-table-wrap">
        <Table rowKey="id" columns={columns} dataSource={clubs} pagination={{ pageSize: 8, showSizeChanger: true }} />
      </div>

      <ClubFormModal open={formOpen} editRecord={editRecord} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <Modal visible={membersModal.open} title={`Thành viên: ${membersModal.club?.tenCLB}`}
        onCancel={() => setMembersModal({ open: false, club: null })} footer={null} width={700} wrapClassName="clb-modal">
        <Table rowKey="id" size="small" dataSource={clubMembers} pagination={false}
          columns={[
            { title: 'Họ tên', dataIndex: 'hoTen', render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
            { title: 'Email', dataIndex: 'email' },
            { title: 'SĐT', dataIndex: 'sdt' },
            { title: 'Sở trường', dataIndex: 'soTruong' },
            { title: 'Ngày ĐK', dataIndex: 'ngayDangKy', render: (v: string) => moment(v).format('DD/MM/YYYY') },
          ]}
          locale={{ emptyText: 'Chưa có thành viên được duyệt' }}
        />
      </Modal>
    </>
  );
};

export default ClubListPage;
