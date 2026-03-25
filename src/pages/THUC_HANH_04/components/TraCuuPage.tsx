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
    if (filled.length < 2) { message.warning('Vui lòng nhập ít nhất 2 tham số tìm kiếm!'); return; }

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
    if (qdIds.length > 0) onTraCuu(qdIds);
  };

  const handleReset = () => { form.resetFields(); setResults([]); setSearched(false); };

  const columns: any[] = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', width: 100, sorter: (a: VanBang, b: VanBang) => a.soVaoSo - b.soVaoSo, render: (v: number) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', sorter: (a: VanBang, b: VanBang) => a.soHieuVanBang.localeCompare(b.soHieuVanBang), render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Sổ VB', dataIndex: 'soVanBangId', render: (id: string) => { const so = soVanBangs.find(s => s.id === id); return so ? <span className="vb-tag-year">Năm {so.nam}</span> : '-'; }},
    { title: 'Quyết định', dataIndex: 'quyetDinhId', render: (id: string) => { const qd = quyetDinhs.find(q => q.id === id); return qd ? <Tooltip title={qd.trichYeu}><span className="vb-tag-qd">{qd.soQuyetDinh}</span></Tooltip> : '-'; }},
    { title: 'Mã SV', dataIndex: 'maSinhVien', sorter: (a: VanBang, b: VanBang) => a.maSinhVien.localeCompare(b.maSinhVien) },
    { title: 'Họ tên', dataIndex: 'hoTen', sorter: (a: VanBang, b: VanBang) => a.hoTen.localeCompare(b.hoTen), render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', render: (d: string) => moment(d).format('DD/MM/YYYY') },
    ...cauHinhs.map(ch => ({
      title: ch.tenTruong, key: `dynamic_${ch.id}`,
      render: (_: any, r: VanBang) => { const val = r.truongBoSung[ch.tenTruong]; return ch.kieuDuLieu === 'Date' && val ? moment(val).format('DD/MM/YYYY') : val ?? '-'; },
    })),
  ];

  const qdStats = useMemo(() => quyetDinhs.filter(q => q.luotTraCuu > 0).sort((a, b) => b.luotTraCuu - a.luotTraCuu), [quyetDinhs]);

  return (
    <div className="vb-search-wrapper">
      {/* Search Form */}
      <Card className="vb-card" title="Tra cứu văn bằng">
        <Alert className="vb-search-alert" message="Nhập ít nhất 2 tham số để tìm kiếm" type="info" showIcon style={{ marginBottom: 20 }} />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="soHieuVanBang" label="Số hiệu văn bằng"><Input placeholder="VD: VB-2024-001" allowClear /></Form.Item></Col>
            <Col span={8}><Form.Item name="soVaoSo" label="Số vào sổ"><Input placeholder="VD: 1" allowClear /></Form.Item></Col>
            <Col span={8}><Form.Item name="maSinhVien" label="Mã sinh viên"><Input placeholder="VD: B20DCCN001" allowClear /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="hoTen" label="Họ và tên"><Input placeholder="VD: Nguyễn Văn An" allowClear /></Form.Item></Col>
            <Col span={8}><Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item></Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24, gap: 8 }}>
              <Button type="primary" className="vb-btn-search" icon={<SearchOutlined />} onClick={handleSearch}>Tìm kiếm</Button>
              <Button className="vb-btn-reset" onClick={handleReset}>Đặt lại</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Results */}
      {searched && (
        <Card className="vb-card" title={`Kết quả tra cứu (${results.length} bản ghi)`}>
          <Table dataSource={results} columns={columns} rowKey="id" pagination={{ pageSize: 5, showSizeChanger: false }} scroll={{ x: 'max-content' }} locale={{ emptyText: 'Không tìm thấy văn bằng phù hợp' }} />
        </Card>
      )}

      {/* Stats */}
      {qdStats.length > 0 && (
        <Card className="vb-card" title="Thống kê lượt tra cứu theo quyết định">
          <Row gutter={16}>
            {qdStats.map(qd => (
              <Col span={8} key={qd.id}>
                <Card size="small" className="vb-stat-card">
                  <Statistic title={<span style={{ fontSize: 12 }}>{qd.soQuyetDinh}</span>} value={qd.luotTraCuu} suffix="lượt" />
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
