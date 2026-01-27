/* ============================================================
 * THUC_HANH_02 — Bài 2: Tab Câu Hỏi
 * Question CRUD with advanced filtering
 * Modernized UI with Ant Design (Segmented, Badge, etc.)
 * ============================================================ */
import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Space,
  Popconfirm,
  Row,
  Col,
  message,
  Empty,
  Typography,
  Tooltip,
  Segmented,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  QuestionCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { chActions } from '../slices';
import type { CauHoi, MucDoKho } from '../types';
import { MUC_DO_LABEL, ALL_MUC_DO } from '../types';
import { formatDate } from '../../common';

const { TextArea } = Input;
const { Text } = Typography;

/* Custom Badge Colors based on difficulty */
const BADGE_COLORS: Record<MucDoKho, string> = {
  nhan_biet: 'green',
  thong_hieu: 'blue',
  van_dung: 'orange',
  van_dung_cao: 'red',
};

/* =============================================================
 * 1. FILTER BAR — Bộ lọc đa điều kiện
 * ============================================================= */
interface FilterBarProps {
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onReset }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((s) => s.cauHoi.filter);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);

  const filteredKKTs = useMemo(() => {
    if (!filter.monHocId) return khoiKienThucs;
    const mh = monHocs.find((m) => m.id === filter.monHocId);
    if (!mh) return khoiKienThucs;
    return khoiKienThucs.filter((k) => mh.khoiKienThucIds.includes(k.id));
  }, [filter.monHocId, monHocs, khoiKienThucs]);

  const updateFilter = (partial: Partial<typeof filter>) => {
    dispatch(chActions.setFilter({ ...filter, ...partial }));
  };

  const segmentedOptions = [
    { label: 'Tất cả', value: 'ALL' },
    ...ALL_MUC_DO.map(m => ({ label: MUC_DO_LABEL[m], value: m }))
  ];

  return (
    <Card 
      size="small" 
      style={{ marginBottom: 24 }} 
      bordered={false}
      bodyStyle={{ padding: '16px 20px' }}
      title={<><FilterOutlined style={{ marginRight: 8, color: '#1890ff' }}/> Bộ lọc tìm kiếm</>}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={7}>
          <Select
            style={{ width: '100%' }}
            placeholder="Lọc theo môn học"
            value={filter.monHocId}
            onChange={(v) => updateFilter({ monHocId: v, khoiKienThucId: undefined })}
            allowClear
            size="large"
            options={monHocs.map(m => ({ label: m.ten, value: m.id }))}
          />
        </Col>
        <Col xs={24} md={7}>
          <Select
            style={{ width: '100%' }}
            placeholder="Lọc theo khối kiến thức"
            value={filter.khoiKienThucId}
            onChange={(v) => updateFilter({ khoiKienThucId: v })}
            allowClear
            size="large"
            disabled={!filter.monHocId && monHocs.length > 0}
            options={filteredKKTs.map(k => ({ label: k.ten, value: k.id }))}
          />
        </Col>
        <Col xs={24} md={10}>
          <Input
            placeholder="Tìm kiếm nội dung câu hỏi hoặc đáp án..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }}/>}
            value={filter.keyword}
            onChange={(e) => updateFilter({ keyword: e.target.value })}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} md={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text type="secondary" strong style={{ fontSize: 13 }}>Mức độ khó:</Text>
            <Segmented
              options={segmentedOptions}
              value={filter.mucDoKho || 'ALL'}
              onChange={(val) => updateFilter({ mucDoKho: val === 'ALL' ? undefined : val as MucDoKho })}
            />
          </div>
        </Col>
        <Col xs={24} md={4}>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              dispatch(chActions.clearFilter());
              onReset();
            }}
            block
            size="large"
            type="dashed"
          >
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

/* =============================================================
 * 2. QUESTION FORM MODAL — Modal thêm/sửa câu hỏi
 * ============================================================= */
interface QuestionFormProps {
  visible: boolean;
  editing: CauHoi | null;
  onClose: () => void;
}

const QuestionFormModal: React.FC<QuestionFormProps> = ({ visible, editing, onClose }) => {
  const dispatch = useAppDispatch();
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const [form] = Form.useForm();
  const [selectedMonHoc, setSelectedMonHoc] = useState<string | undefined>(editing?.monHocId);

  React.useEffect(() => {
    if (visible) {
      if (editing) {
        form.setFieldsValue(editing);
        setSelectedMonHoc(editing.monHocId);
      } else {
        form.resetFields();
        setSelectedMonHoc(undefined);
      }
    }
  }, [visible, editing, form]);

  const filteredKKTs = useMemo(() => {
    if (!selectedMonHoc) return khoiKienThucs;
    const mh = monHocs.find((m) => m.id === selectedMonHoc);
    if (!mh) return khoiKienThucs;
    return khoiKienThucs.filter((k) => mh.khoiKienThucIds.includes(k.id));
  }, [selectedMonHoc, monHocs, khoiKienThucs]);

  const handleSave = () => {
    form.validateFields().then((vals) => {
      const data = {
        ...vals,
        chuong: vals.chuong || '',
        baiHoc: vals.baiHoc || '',
      };
      if (editing) {
        dispatch(chActions.updateCauHoi({ ...editing, ...data }));
        message.success('Đã cập nhật câu hỏi');
      } else {
        dispatch(chActions.addCauHoi(data));
        message.success('Đã thêm câu hỏi mới');
      }
      onClose();
    });
  };

  return (
    <Modal
      title={<div style={{ fontSize: 18, fontWeight: 600 }}>{editing ? 'Sửa thông tin câu hỏi' : 'Tạo câu hỏi mới'}</div>}
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      okText="Lưu câu hỏi"
      cancelText="Hủy bỏ"
      width={750}
      wrapClassName="exam-admin-modal"
      destroyOnClose
      centered
      okButtonProps={{ size: 'large', style: { borderRadius: 6 } }}
      cancelButtonProps={{ size: 'large', style: { borderRadius: 6 } }}
    >
      <Form form={form} layout="vertical" initialValues={{ diem: 1, thoiGianPhut: 5 }} style={{ marginTop: 24 }}>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="monHocId"
              label="Môn học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select
                placeholder="Chọn môn học"
                size="large"
                onChange={(v) => {
                  setSelectedMonHoc(v);
                  form.setFieldsValue({ khoiKienThucId: undefined });
                }}
                options={monHocs.map(m => ({ label: m.ten, value: m.id }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="khoiKienThucId"
              label="Khối kiến thức"
              rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
            >
              <Select placeholder="Chọn khối kiến thức" size="large" options={filteredKKTs.map(k => ({ label: k.ten, value: k.id }))} disabled={!selectedMonHoc}/>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="noiDung"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
        >
          <TextArea rows={4} placeholder="Nhập chi tiết nội dung câu hỏi tự luận..." style={{ borderRadius: 8 }}/>
        </Form.Item>

        <Form.Item
          name="dapAn"
          label="Đáp án mẫu / Hướng dẫn chấm"
          rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}
        >
          <TextArea rows={3} placeholder="Mô tả đáp án mẫu hoặc các ý chính cần có..." style={{ borderRadius: 8 }}/>
        </Form.Item>

        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              name="mucDoKho"
              label="Mức độ khó"
              rules={[{ required: true, message: 'Chọn mức độ' }]}
            >
              <Select placeholder="Chọn mức độ" size="large">
                {ALL_MUC_DO.map((m) => (
                  <Select.Option key={m} value={m}>
                    <Badge status={BADGE_COLORS[m] as any} text={MUC_DO_LABEL[m]} />
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="diem"
              label="Điểm mặc định"
              rules={[{ required: true, message: 'Nhập điểm' }]}
            >
              <InputNumber min={0.25} max={10} step={0.25} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="thoiGianPhut"
              label="Thời gian (phút)"
              rules={[{ required: true, message: 'Nhập thời gian' }]}
            >
              <InputNumber min={1} max={120} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

/* =============================================================
 * 3. MAIN EXPORT — Tab Câu Hỏi (List + Filter + Form)
 * ============================================================= */
const CauHoiTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const filter = useAppSelector((s) => s.cauHoi.filter);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CauHoi | null>(null);

  const monHocMap = useMemo(() => new Map(monHocs.map((m) => [m.id, m.ten])), [monHocs]);
  const kktMap = useMemo(() => new Map(khoiKienThucs.map((k) => [k.id, k.ten])), [khoiKienThucs]);

  const filtered = useMemo(() => {
    let list = [...cauHois];
    if (filter.monHocId) list = list.filter((c) => c.monHocId === filter.monHocId);
    if (filter.khoiKienThucId) list = list.filter((c) => c.khoiKienThucId === filter.khoiKienThucId);
    if (filter.mucDoKho) list = list.filter((c) => c.mucDoKho === filter.mucDoKho);
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      list = list.filter((c) => c.noiDung.toLowerCase().includes(kw) || c.dapAn.toLowerCase().includes(kw));
    }
    if (filter.diemMin !== undefined) list = list.filter((c) => c.diem >= filter.diemMin!);
    if (filter.diemMax !== undefined) list = list.filter((c) => c.diem <= filter.diemMax!);
    return list;
  }, [cauHois, filter]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (r: CauHoi) => {
    setEditing(r);
    setModalOpen(true);
  };

  const columns = [
    { title: '#', key: 'stt', width: 50, render: (_: any, __: any, i: number) => <span style={{ color: '#8c8c8c' }}>{i + 1}</span> },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'noiDung',
      key: 'noiDung',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v} placement="topLeft">
          <Text style={{ color: '#262626' }}>{v.length > 70 ? v.slice(0, 70) + '...' : v}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      width: 140,
      render: (id: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{monHocMap.get(id) || '—'}</Tag>,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'khoiKienThucId',
      key: 'khoiKienThucId',
      width: 140,
      render: (id: string) => <Tag color="cyan" style={{ borderRadius: 4 }}>{kktMap.get(id) || '—'}</Tag>,
    },
    {
      title: 'Mức độ',
      dataIndex: 'mucDoKho',
      key: 'mucDoKho',
      width: 130,
      render: (v: MucDoKho) => (
        <Badge 
          status={BADGE_COLORS[v] as any} 
          text={<span style={{ fontWeight: 500 }}>{MUC_DO_LABEL[v]}</span>} 
        />
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'diem',
      key: 'diem',
      width: 80,
      align: 'center' as const,
      sorter: (a: CauHoi, b: CauHoi) => a.diem - b.diem,
      render: (v: number) => <strong>{v}đ</strong>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: any, r: CauHoi) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" style={{ color: '#1890ff' }} icon={<EditOutlined />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm
            title="Xóa câu hỏi này?"
            onConfirm={() => {
              dispatch(chActions.deleteCauHoi(r.id));
              message.success('Đã xóa câu hỏi');
            }}
            placement="topRight"
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <FilterBar onReset={() => {}} />

      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <QuestionCircleOutlined style={{ color: '#fa8c16', marginRight: 8, fontSize: 18 }} /> 
            <span style={{ fontSize: 16 }}>Ngân hàng câu hỏi tự luận</span>
            <Tag style={{ marginLeft: 12, borderRadius: 12 }} color="orange">{filtered.length} câu</Tag>
          </div>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 6, background: '#fa8c16', borderColor: '#fa8c16' }}>
            Thêm câu hỏi mới
          </Button>
        }
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng số: ${total} câu hỏi`, showSizeChanger: false }}
          locale={{
            emptyText: (
              <Empty
                description={cauHois.length === 0 ? 'Ngân hàng chưa có câu hỏi nào' : 'Không tìm thấy câu hỏi phù hợp với bộ lọc'}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <QuestionFormModal
        visible={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CauHoiTab;
