import React, { useState, useMemo } from 'react';
import { Button, Space, Table, Tag, Tooltip } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { CauLacBo, DonDangKy } from '../types';
import TransferClubModal from './TransferClubModal';

interface Props {
  memberships: DonDangKy[];
  clubs: CauLacBo[];
  onTransfer: (ids: string[], newClubId: string) => void;
}

const MembersPage: React.FC<Props> = ({ memberships, clubs, onTransfer }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transferOpen, setTransferOpen] = useState(false);

  const approvedMembers = useMemo(
    () => memberships.filter((m) => m.trangThai === 'Approved'),
    [memberships],
  );

  const handleTransferConfirm = (newClubId: string) => {
    onTransfer(selectedRowKeys as string[], newClubId);
    setTransferOpen(false);
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      sorter: (a: DonDangKy, b: DonDangKy) => a.hoTen.localeCompare(b.hoTen),
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'sdt', width: 120 },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      width: 100,
      filters: [{ text: 'Nam', value: 'Nam' }, { text: 'Nữ', value: 'Nữ' }, { text: 'Khác', value: 'Khác' }],
      onFilter: (v: any, r: DonDangKy) => r.gioiTinh === v,
    },
    { title: 'Địa chỉ', dataIndex: 'diaChi' },
    { title: 'Sở trường', dataIndex: 'soTruong' },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      filters: clubs.map((c) => ({ text: c.tenCLB, value: c.id })),
      onFilter: (v: any, r: DonDangKy) => r.clubId === v,
      render: (id: string) => {
        const club = clubs.find((c) => c.id === id);
        return <Tag color="blue">{club?.tenCLB ?? id}</Tag>;
      },
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'ngayDangKy',
      sorter: (a: DonDangKy, b: DonDangKy) => a.ngayDangKy.localeCompare(b.ngayDangKy),
      render: (v: string) => moment(v).format('DD/MM/YYYY'),
      width: 130,
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Tooltip title="Đổi CLB cho các thành viên đã chọn">
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={() => setTransferOpen(true)}
              >
                Đổi CLB ({selectedRowKeys.length})
              </Button>
            </Tooltip>
          )}
        </Space>
        <span style={{ color: '#888', fontSize: 13 }}>
          Tổng: <b>{approvedMembers.length}</b> thành viên
        </span>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={approvedMembers}
        bordered
        pagination={{ pageSize: 8, showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        style={{ borderRadius: 8 }}
      />

      <TransferClubModal
        open={transferOpen}
        memberCount={selectedRowKeys.length}
        clubs={clubs}
        onCancel={() => setTransferOpen(false)}
        onConfirm={handleTransferConfirm}
      />
    </>
  );
};

export default MembersPage;
