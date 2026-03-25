import React, { useState, useMemo } from 'react';
import { Card, Form, Input, DatePicker, Button, Table, Tag, Tooltip, Row, Col, Alert, Statistic, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { VanBang, SoVanBang, QuyetDinhTotNghiep, CauHinhTruong } from '../types';

interface Props {
  vanBangs: VanBang[];
  soVanBangs: SoVanBang[];
  quyetDinhs: QuyetDinhTotNghiep[];
  cauHinhs: CauHinhTruong[];
  onTraCuu: (quyetDinhIds: string[]) => void;
}

const TraCuuPage: React.FC<Props> = ({ vanBangs, soVanBangs, quyetDinhs, cauHinhs, onTraCuu }) => {
  const [form] = Form.useForm();
  const [results, setResults] = useState<VanBang[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const filled = Object.entries(values).filter(([_, v]) => v !== undefined && v !== '' && v !== null);
    if (filled.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số tìm kiếm!');
      return;
    }

    const filtered = vanBangs.filter(vb => {
      if (values.soHieuVanBang && !vb.soHieuVanBang.toLowerCase().includes(values.soHieuVanBang.toLowerCase())) return false;
      if (values.soVaoSo && vb.soVaoSo !== Number(values.soVaoSo)) return false;
      if (values.maSinhVien && !vb.maSinhVien.toLowerCase().includes(values.maSinhVien.toLowerCase())) return false;
      if (values.hoTen && !vb.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) return false;
      if (values.ngaySinh && vb.ngaySinh !== values.ngaySinh.format('YYYY-MM-DD')) return false;
      return true;
    });

    setResults(filtered);
    setSearched(true);

    const qdIds = [...new Set(filtered.map(vb => vb.quyetDinhId))];
    if (qdIds.length > 0) {
      onTraCuu(qdIds);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setResults([]);
    setSearched(false);
  };

  const columns: any[] = [
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
    ...cauHinhs.map(ch => ({
      title: ch.tenTruong,
      key: `dynamic_${ch.id}`,
      render: (_: any, record: VanBang) => {
        const val = record.truongBoSung[ch.tenTruong];
        if (ch.kieuDuLieu === 'Date' && val) return moment(val).format('DD/MM/YYYY');
        return val ?? '-';
      },
    })),
  ];

  const qdStats = useMemo(() => {
    return quyetDinhs.filter(q => q.luotTraCuu > 0).sort((a, b) => b.luotTraCuu - a.luotTraCuu);
  }, [quyetDinhs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card
        title={<span style={{ fontWeight: 600 }}>🔍 Tra cứu văn bằng</span>}
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Alert
          message="Nhập ít nhất 2 tham số để tìm kiếm"
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
                <Input placeholder="VD: VB-2024-001" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="soVaoSo" label="Số vào sổ">
                <Input placeholder="VD: 1" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maSinhVien" label="Mã sinh viên">
                <Input placeholder="VD: B20DCCN001" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="hoTen" label="Họ và tên">
                <Input placeholder="VD: Nguyễn Văn An" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ngaySinh" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24, gap: 8 }}>
              <Button
                type="primary" icon={<SearchOutlined />} onClick={handleSearch}
                style={{ background: '#9B1B30', borderColor: '#9B1B30', flex: 1 }}
              >
                Tìm kiếm
              </Button>
              <Button onClick={handleReset} style={{ flex: 1 }}>Đặt lại</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {searched && (
        <Card
          title={<span style={{ fontWeight: 600 }}>Kết quả tra cứu ({results.length} bản ghi)</span>}
          style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <Table
            dataSource={results}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5, showSizeChanger: false }}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Không tìm thấy văn bằng phù hợp' }}
          />
        </Card>
      )}

      {qdStats.length > 0 && (
        <Card
          title={<span style={{ fontWeight: 600 }}>📊 Thống kê lượt tra cứu theo quyết định</span>}
          style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <Row gutter={16}>
            {qdStats.map(qd => (
              <Col span={8} key={qd.id}>
                <Card
                  size="small"
                  style={{
                    borderRadius: 10, textAlign: 'center',
                    borderLeft: '4px solid #9B1B30', marginBottom: 12,
                  }}
                >
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>{qd.soQuyetDinh}</span>}
                    value={qd.luotTraCuu}
                    suffix="lượt"
                    valueStyle={{ color: '#9B1B30', fontWeight: 700 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default TraCuuPage;
