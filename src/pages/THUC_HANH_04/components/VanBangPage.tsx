import React, { useState } from 'react';
import { Table, Button, Card, Popconfirm, Space, Tag, Modal, Form, Input, InputNumber, DatePicker, Select, Tooltip, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { VanBang, SoVanBang, QuyetDinhTotNghiep, CauHinhTruong } from '../types';

interface Props {
  data: VanBang[];
  soVanBangs: SoVanBang[];
  quyetDinhs: QuyetDinhTotNghiep[];
  cauHinhs: CauHinhTruong[];
  onAdd: (data: Omit<VanBang, 'id' | 'soVaoSo'>) => void;
  onEdit: (id: string, data: Partial<VanBang>) => void;
  onDelete: (id: string) => void;
}

const VanBangPage: React.FC<Props> = ({ data, soVanBangs, quyetDinhs, cauHinhs, onAdd, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VanBang | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (record: VanBang) => {
    setEditing(record);
    const fv: any = { soHieuVanBang: record.soHieuVanBang, soVanBangId: record.soVanBangId, quyetDinhId: record.quyetDinhId, maSinhVien: record.maSinhVien, hoTen: record.hoTen, ngaySinh: moment(record.ngaySinh) };
    cauHinhs.forEach(ch => {
      const val = record.truongBoSung[ch.tenTruong];
      fv[`dynamic_${ch.id}`] = ch.kieuDuLieu === 'Date' && val ? moment(val) : val;
    });
    form.setFieldsValue(fv);
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const truongBoSung: Record<string, any> = {};
      cauHinhs.forEach(ch => {
        const val = values[`dynamic_${ch.id}`];
        truongBoSung[ch.tenTruong] = ch.kieuDuLieu === 'Date' && val ? val.format('YYYY-MM-DD') : val;
      });
      const payload = { soHieuVanBang: values.soHieuVanBang, soVanBangId: values.soVanBangId, quyetDinhId: values.quyetDinhId, maSinhVien: values.maSinhVien, hoTen: values.hoTen, ngaySinh: values.ngaySinh.format('YYYY-MM-DD'), truongBoSung };
      editing ? onEdit(editing.id, payload) : onAdd(payload as Omit<VanBang, 'id' | 'soVaoSo'>);
      setModalOpen(false);
    });
  };

  const fixedColumns: any[] = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', width: 100, sorter: (a: VanBang, b: VanBang) => a.soVaoSo - b.soVaoSo, render: (v: number) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', sorter: (a: VanBang, b: VanBang) => a.soHieuVanBang.localeCompare(b.soHieuVanBang), render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Sổ VB', dataIndex: 'soVanBangId', render: (id: string) => { const so = soVanBangs.find(s => s.id === id); return so ? <span className="vb-tag-year">Năm {so.nam}</span> : '-'; }},
    { title: 'Quyết định', dataIndex: 'quyetDinhId', render: (id: string) => { const qd = quyetDinhs.find(q => q.id === id); return qd ? <Tooltip title={qd.trichYeu}><span className="vb-tag-qd">{qd.soQuyetDinh}</span></Tooltip> : '-'; }},
    { title: 'Mã SV', dataIndex: 'maSinhVien', sorter: (a: VanBang, b: VanBang) => a.maSinhVien.localeCompare(b.maSinhVien) },
    { title: 'Họ tên', dataIndex: 'hoTen', sorter: (a: VanBang, b: VanBang) => a.hoTen.localeCompare(b.hoTen), render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', render: (d: string) => moment(d).format('DD/MM/YYYY') },
  ];

  const dynamicColumns = cauHinhs.map(ch => ({
    title: ch.tenTruong, key: `dynamic_${ch.id}`,
    render: (_: any, r: VanBang) => { const val = r.truongBoSung[ch.tenTruong]; return ch.kieuDuLieu === 'Date' && val ? moment(val).format('DD/MM/YYYY') : val ?? '-'; },
  }));

  const actionColumn = {
    title: 'Thao tác', key: 'action', fixed: 'right' as const, width: 100,
    render: (_: any, r: VanBang) => (
      <Space size={4}>
        <Button type="text" className="vb-action-btn vb-action-edit" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(r.id)} okText="Xóa" cancelText="Hủy">
          <Button type="text" className="vb-action-btn vb-action-delete" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <>
      <Card className="vb-card" title="Danh sách văn bằng tốt nghiệp"
        extra={<Button type="primary" className="vb-btn-primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm văn bằng</Button>}>
        <Table dataSource={data} columns={[...fixedColumns, ...dynamicColumns, actionColumn]} rowKey="id" pagination={{ pageSize: 5, showSizeChanger: false }} scroll={{ x: 'max-content' }} />
      </Card>

      <Modal title={editing ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng mới'} visible={modalOpen} onOk={handleOk}
        onCancel={() => setModalOpen(false)} okText={editing ? 'Cập nhật' : 'Thêm mới'} cancelText="Hủy"
        wrapClassName="vb-modal" centered destroyOnClose width={680}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true, message: 'Bắt buộc' }]}><Input placeholder="VD: VB-2024-001" /></Form.Item></Col>
            <Col span={12}><Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true, message: 'Bắt buộc' }]}><Input placeholder="VD: B20DCCN001" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Bắt buộc' }]}><Input placeholder="Họ và tên sinh viên" /></Form.Item></Col>
            <Col span={12}><Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true, message: 'Bắt buộc' }]}><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="soVanBangId" label="Sổ văn bằng" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Select placeholder="Chọn sổ văn bằng">{soVanBangs.map(s => <Select.Option key={s.id} value={s.id}>Năm {s.nam}</Select.Option>)}</Select>
            </Form.Item></Col>
            <Col span={12}><Form.Item name="quyetDinhId" label="Quyết định TN" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Select placeholder="Chọn quyết định">{quyetDinhs.map(q => <Select.Option key={q.id} value={q.id}>{q.soQuyetDinh}</Select.Option>)}</Select>
            </Form.Item></Col>
          </Row>
          {cauHinhs.length > 0 && (
            <>
              <div className="vb-section-divider"><span className="vb-section-label">Thông tin bổ sung</span></div>
              <Row gutter={16}>
                {cauHinhs.map(ch => (
                  <Col span={12} key={ch.id}>
                    <Form.Item name={`dynamic_${ch.id}`} label={ch.tenTruong}>
                      {ch.kieuDuLieu === 'String' && <Input />}
                      {ch.kieuDuLieu === 'Number' && <InputNumber style={{ width: '100%' }} />}
                      {ch.kieuDuLieu === 'Date' && <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default VanBangPage;
