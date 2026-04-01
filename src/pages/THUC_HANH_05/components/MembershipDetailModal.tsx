import React from 'react';
import { Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';
import type { CauLacBo, DonDangKy } from '../types';

interface Props { open: boolean; record: DonDangKy | null; clubs: CauLacBo[]; onCancel: () => void; }

const STATUS_COLOR: Record<string, string> = { Pending: 'orange', Approved: 'success', Rejected: 'error' };
const STATUS_LABEL: Record<string, string> = { Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' };

const MembershipDetailModal: React.FC<Props> = ({ open, record, clubs, onCancel }) => {
  if (!record) return null;
  const club = clubs.find(c => c.id === record.clubId);

  return (
    <Modal visible={open} title="Chi tiết đơn đăng ký" onCancel={onCancel} footer={null} width={680} wrapClassName="clb-modal" centered>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Họ và tên" span={2}><span style={{ fontWeight: 500 }}>{record.hoTen}</span></Descriptions.Item>
        <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{record.sdt}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{record.gioiTinh}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{record.diaChi}</Descriptions.Item>
        <Descriptions.Item label="Sở trường" span={2}>{record.soTruong}</Descriptions.Item>
        <Descriptions.Item label="Câu lạc bộ" span={2}><span className="clb-tag-club">{club?.tenCLB ?? record.clubId}</span></Descriptions.Item>
        <Descriptions.Item label="Ngày đăng ký">{moment(record.ngayDangKy).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái"><Tag className="clb-tag-status" color={STATUS_COLOR[record.trangThai]}>{STATUS_LABEL[record.trangThai]}</Tag></Descriptions.Item>
        <Descriptions.Item label="Lý do đăng ký" span={2}>{record.lyDo}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>{record.ghiChu || '—'}</Descriptions.Item>
        {record.trangThai === 'Rejected' && (
          <Descriptions.Item label="Lý do từ chối" span={2}><span style={{ color: '#ef4444' }}>{record.lyDoTuChoi || '—'}</span></Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default MembershipDetailModal;
