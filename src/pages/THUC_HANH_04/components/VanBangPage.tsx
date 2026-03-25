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

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: VanBang) => {
    setEditing(record);
    const formValues: any = {
      soHieuVanBang: record.soHieuVanBang,
      soVanBangId: record.soVanBangId,
      quyetDinhId: record.quyetDinhId,
      maSinhVien: record.maSinhVien,
      hoTen: record.hoTen,
      ngaySinh: moment(record.ngaySinh),
    };
    cauHinhs.forEach(ch => {
      const val = record.truongBoSung[ch.tenTruong];
      if (ch.kieuDuLieu === 'Date' && val) {
        formValues[`dynamic_${ch.id}`] = moment(val);
      } else {
        formValues[`dynamic_${ch.id}`] = val;
      }
    });
    form.setFieldsValue(formValues);
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const truongBoSung: Record<string, any> = {};
      cauHinhs.forEach(ch => {
        const val = values[`dynamic_${ch.id}`];
        if (ch.kieuDuLieu === 'Date' && val) {
          truongBoSung[ch.tenTruong] = val.format('YYYY-MM-DD');
        } else {
          truongBoSung[ch.tenTruong] = val;
        }
      });
      const payload = {
        soHieuVanBang: values.soHieuVanBang,
        soVanBangId: values.soVanBangId,
        quyetDinhId: values.quyetDinhId,
        maSinhVien: values.maSinhVien,
        hoTen: values.hoTen,
        ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
        truongBoSung,
      };
      if (editing) {
        onEdit(editing.id, payload);
      } else {
        onAdd(payload as Omit<VanBang, 'id' | 'soVaoSo'>);
      }
      setModalOpen(false);
    });
  };

  const fixedColumns: any[] = [
    {
      title: 'Số vào sổ', dataIndex: 'soVaoSo', width: 100,
      sorter: (a: VanBang, b: VanBang) => a.soVaoSo - b.soVaoSo,
    },
    {
      title: 'Số hiệu VB', dataIndex: 'soHieuVanBang',
      sorter: (a: VanBang, b: VanBang) => a.soHieuVanBang.localeCompare(b.soHieuVanBang),
    },
    {
      title: 'Sổ VB', dataIndex: 'soVanBangId',
      render: (id: string) => {
        const so = soVanBangs.find(s => s.id === id);
        return so ? <Tag color="#9B1B30">Năm {so.nam}</Tag> : '-';
      },
    },
    {
      title: 'Quyết định', dataIndex: 'quyetDinhId',
      render: (id: string) => {
        const qd = quyetDinhs.find(q => q.id === id);
        return qd ? <Tooltip title={qd.trichYeu}><Tag color="processing">{qd.soQuyetDinh}</Tag></Tooltip> : '-';
      },
    },
    {
      title: 'Mã SV', dataIndex: 'maSinhVien',
      sorter: (a: VanBang, b: VanBang) => a.maSinhVien.localeCompare(b.maSinhVien),
    },
    {
      title: 'Họ tên', dataIndex: 'hoTen',
      sorter: (a: VanBang, b: VanBang) => a.hoTen.localeCompare(b.hoTen),
    },
    {
      title: 'Ngày sinh', dataIndex: 'ngaySinh',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
  ];

  const dynamicColumns = cauHinhs.map(ch => ({
    title: ch.tenTruong,
    key: `dynamic_${ch.id}`,
    render: (_: any, record: VanBang) => {
      const val = record.truongBoSung[ch.tenTruong];
      if (ch.kieuDuLieu === 'Date' && val) return moment(val).format('DD/MM/YYYY');
      return val ?? '-';
    },
  }));

  const actionColumn = {
    title: 'Thao tác', key: 'action', fixed: 'right' as const, width: 100,
    render: (_: any, record: VanBang) => (
      <Space>
        <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)} />
        <Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  const columns = [...fixedColumns, ...dynamicColumns, actionColumn];

  return (
    <>
      <Card
        title={<span style={{ fontWeight: 600 }}>Danh sách văn bằng tốt nghiệp</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
            style={{ background: '#9B1B30', borderColor: '#9B1B30' }}>
            Thêm văn bằng
          </Button>
        }
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={editing ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng mới'}
        visible={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#9B1B30', borderColor: '#9B1B30' } }}
        destroyOnClose
        width={680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="VD: VB-2024-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="VD: B20DCCN001" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="Họ và tên sinh viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soVanBangId" label="Sổ văn bằng" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Select placeholder="Chọn sổ văn bằng">
                  {soVanBangs.map(s => (
                    <Select.Option key={s.id} value={s.id}>Năm {s.nam}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quyetDinhId" label="Quyết định TN" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Select placeholder="Chọn quyết định">
                  {quyetDinhs.map(q => (
                    <Select.Option key={q.id} value={q.id}>{q.soQuyetDinh}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {cauHinhs.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0 16px', paddingTop: 16 }}>
                <span style={{ fontWeight: 600, color: '#9B1B30' }}>Thông tin bổ sung</span>
              </div>
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
