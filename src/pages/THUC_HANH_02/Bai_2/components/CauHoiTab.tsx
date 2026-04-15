
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { chActions } from '../slices';
import type { CauHoi, MucDoKho } from '../types';
import { MUC_DO_LABEL, MUC_DO_COLOR, ALL_MUC_DO } from '../types';
import { formatDate } from '../../common';

const { TextArea } = Input;
const { Text } = Typography;


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

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="📖 Lọc môn học"
            value={filter.monHocId}
            onChange={(v) => updateFilter({ monHocId: v, khoiKienThucId: undefined })}
            allowClear
          >
            {monHocs.map((m) => (
              <Select.Option key={m.id} value={m.id}>{m.ten}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="📚 Lọc khối kiến thức"
            value={filter.khoiKienThucId}
            onChange={(v) => updateFilter({ khoiKienThucId: v })}
            allowClear
          >
            {filteredKKTs.map((k) => (
              <Select.Option key={k.id} value={k.id}>{k.ten}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            style={{ width: '100%' }}
            placeholder="⭐ Mức độ"
            value={filter.mucDoKho}
            onChange={(v) => updateFilter({ mucDoKho: v })}
            allowClear
          >
            {ALL_MUC_DO.map((m) => (
              <Select.Option key={m} value={m}>{MUC_DO_LABEL[m]}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="🔍 Tìm nội dung..."
            prefix={<SearchOutlined />}
            value={filter.keyword}
            onChange={(e) => updateFilter({ keyword: e.target.value })}
            allowClear
          />
        </Col>
        <Col xs={24} sm={24} md={2}>
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              dispatch(chActions.clearFilter());
              onReset();
            }}
            block
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Card>
  );
};


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
        message.success('Đã thêm câu hỏi');
      }
      onClose();
    });
  };

  return (
    <Modal
      title={editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ diem: 1, thoiGianPhut: 5 }}>
        <Form.Item
          name="noiDung"
          label="Nội dung câu hỏi"
          rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận..." />
        </Form.Item>

        <Form.Item
          name="dapAn"
          label="Đáp án mẫu"
          rules={[{ required: true, message: 'Nhập đáp án' }]}
        >
          <TextArea rows={3} placeholder="Đáp án mẫu cho câu hỏi..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="monHocId"
              label="Môn học"
              rules={[{ required: true, message: 'Chọn môn học' }]}
            >
              <Select
                placeholder="Chọn môn học"
                onChange={(v) => {
                  setSelectedMonHoc(v);
                  form.setFieldsValue({ khoiKienThucId: undefined });
                }}
              >
                {monHocs.map((m) => (
                  <Select.Option key={m.id} value={m.id}>{m.ten}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="khoiKienThucId"
              label="Khối kiến thức"
              rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
            >
              <Select placeholder="Chọn khối kiến thức">
                {filteredKKTs.map((k) => (
                  <Select.Option key={k.id} value={k.id}>{k.ten}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="mucDoKho"
              label="Mức độ khó"
              rules={[{ required: true, message: 'Chọn mức độ' }]}
            >
              <Select placeholder="Chọn mức độ">
                {ALL_MUC_DO.map((m) => (
                  <Select.Option key={m} value={m}>
                    <Tag color={MUC_DO_COLOR[m]} style={{ marginRight: 0 }}>{MUC_DO_LABEL[m]}</Tag>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="diem"
              label="Điểm"
              rules={[{ required: true, message: 'Nhập điểm' }]}
            >
              <InputNumber min={0.25} max={10} step={0.25} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="thoiGianPhut"
              label="Thời gian (phút)"
              rules={[{ required: true, message: 'Nhập thời gian' }]}
            >
              <InputNumber min={1} max={120} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="chuong" label="Chương">
              <Input placeholder="VD: Chương 1, Chương 2..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="baiHoc" label="Bài học">
              <Input placeholder="VD: Bài 1, Bài 2..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};


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
    { title: '#', key: 'stt', width: 45, render: (_: any, __: any, i: number) => i + 1 },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <Text>{v.length > 80 ? v.slice(0, 80) + '...' : v}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      width: 130,
      render: (id: string) => <Tag color="blue">{monHocMap.get(id) || '—'}</Tag>,
    },
    {
      title: 'Khối KT',
      dataIndex: 'khoiKienThucId',
      key: 'khoiKienThucId',
      width: 120,
      render: (id: string) => <Tag color="geekblue">{kktMap.get(id) || '—'}</Tag>,
    },
    {
      title: 'Mức độ',
      dataIndex: 'mucDoKho',
      key: 'mucDoKho',
      width: 120,
      render: (v: MucDoKho) => <Tag color={MUC_DO_COLOR[v]}>{MUC_DO_LABEL[v]}</Tag>,
    },
    {
      title: 'Điểm',
      dataIndex: 'diem',
      key: 'diem',
      width: 65,
      sorter: (a: CauHoi, b: CauHoi) => a.diem - b.diem,
    },
    {
      title: 'Phút',
      dataIndex: 'thoiGianPhut',
      key: 'thoiGianPhut',
      width: 60,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, r: CauHoi) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Xóa câu hỏi này?"
            onConfirm={() => {
              dispatch(chActions.deleteCauHoi(r.id));
              message.success('Đã xóa');
            }}
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <FilterBar onReset={() => {}} />

      <Card
        title={
          <>
            <QuestionCircleOutlined /> Câu hỏi tự luận ({filtered.length}/{cauHois.length})
          </>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm câu hỏi
          </Button>
        }
        size="small"
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 8, size: 'small', showTotal: (t) => `Tổng: ${t}` }}
          locale={{
            emptyText: (
              <Empty
                description={cauHois.length === 0 ? 'Chưa có câu hỏi nào' : 'Không tìm thấy kết quả'}
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
