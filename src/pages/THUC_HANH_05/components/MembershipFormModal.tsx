import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { CauLacBo, DonDangKy, GioiTinh } from '../types';

interface Props {
  open: boolean; editRecord: DonDangKy | null; clubs: CauLacBo[];
  onCancel: () => void; onSubmit: (data: Omit<DonDangKy, 'id'>) => void;
}

const { TextArea } = Input;

const MembershipFormModal: React.FC<Props> = ({ open, editRecord, clubs, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) { editRecord ? form.setFieldsValue(editRecord) : form.resetFields(); }
  }, [open, editRecord]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit({ ...values, trangThai: editRecord?.trangThai ?? 'Pending', lyDoTuChoi: editRecord?.lyDoTuChoi ?? '',
        ngayDangKy: editRecord?.ngayDangKy ?? new Date().toISOString().slice(0, 10) });
    });
  };

  return (
    <Modal visible={open} title={editRecord ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
      onCancel={onCancel} onOk={handleOk} okText={editRecord ? 'Cập nhật' : 'Thêm mới'} cancelText="Hủy"
      width={680} wrapClassName="clb-modal" centered destroyOnClose>
      <Form form={form} layout="vertical">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}><Input placeholder="Nguyễn Văn A" /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}><Input placeholder="email@example.com" /></Form.Item>
          <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}><Input placeholder="09xxxxxxxx" /></Form.Item>
          <Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true, message: 'Chọn giới tính' }]}>
            <Select placeholder="Chọn giới tính">{(['Nam', 'Nữ', 'Khác'] as GioiTinh[]).map(g => <Select.Option key={g} value={g}>{g}</Select.Option>)}</Select>
          </Form.Item>
        </div>
        <Form.Item name="diaChi" label="Địa chỉ"><Input placeholder="Địa chỉ thường trú" /></Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="soTruong" label="Sở trường"><Input placeholder="Lập trình, Âm nhạc..." /></Form.Item>
          <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true, message: 'Chọn CLB' }]}>
            <Select placeholder="Chọn CLB muốn tham gia">{clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.tenCLB}</Select.Option>)}</Select>
          </Form.Item>
        </div>
        <Form.Item name="lyDo" label="Lý do đăng ký" rules={[{ required: true, message: 'Nhập lý do' }]}><TextArea rows={3} placeholder="Nêu lý do muốn tham gia câu lạc bộ..." /></Form.Item>
        <Form.Item name="ghiChu" label="Ghi chú"><TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" /></Form.Item>
      </Form>
    </Modal>
  );
};

export default MembershipFormModal;
