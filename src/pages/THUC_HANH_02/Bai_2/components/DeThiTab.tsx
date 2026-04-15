
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
  Alert,
  Divider,
  Statistic,
  Descriptions,
  List,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  SaveOutlined,
  FileTextOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { dtActions } from '../slices';
import type { MatranCell, MucDoKho, CauTrucDeThi, DeThi, ExamHeaderInfo } from '../types';
import { MUC_DO_LABEL, MUC_DO_COLOR, ALL_MUC_DO } from '../types';
import { generateExam, calcMatranSummary, checkDuplicate } from '../utils';
import { formatDate } from '../../common';

const { Text, Title } = Typography;


interface MatrixEditorProps {
  monHocId: string;
  matran: MatranCell[];
  onChange: (matran: MatranCell[]) => void;
}

const MatrixEditor: React.FC<MatrixEditorProps> = ({ monHocId, matran, onChange }) => {
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);

  const mh = monHocs.find((m) => m.id === monHocId);
  const relatedKKTs = useMemo(() => {
    if (!mh) return [];
    return khoiKienThucs.filter((k) => mh.khoiKienThucIds.includes(k.id));
  }, [mh, khoiKienThucs]);

  const getVal = (kktId: string, muc: MucDoKho): number => {
    const cell = matran.find((c) => c.khoiKienThucId === kktId && c.mucDoKho === muc);
    return cell?.soLuong || 0;
  };

  const getAvailable = (kktId: string, muc: MucDoKho): number => {
    return cauHois.filter(
      (q) =>
        q.monHocId === monHocId &&
        q.khoiKienThucId === kktId &&
        q.mucDoKho === muc,
    ).length;
  };

  const setVal = (kktId: string, muc: MucDoKho, val: number) => {
    const newMatran = matran.filter(
      (c) => !(c.khoiKienThucId === kktId && c.mucDoKho === muc),
    );
    if (val > 0) {
      newMatran.push({ khoiKienThucId: kktId, mucDoKho: muc, soLuong: val });
    }
    onChange(newMatran);
  };

  const summary = calcMatranSummary(matran, cauHois, monHocId);

  const columns = [
    {
      title: 'Khối kiến thức',
      dataIndex: 'ten',
      key: 'ten',
      width: 180,
      fixed: 'left' as const,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    ...ALL_MUC_DO.map((muc) => ({
      title: (
        <Tag color={MUC_DO_COLOR[muc]} style={{ marginRight: 0 }}>
          {MUC_DO_LABEL[muc]}
        </Tag>
      ),
      key: muc,
      width: 130,
      render: (_: any, row: any) => {
        const available = getAvailable(row.id, muc);
        const val = getVal(row.id, muc);
        const isOver = val > available;
        return (
          <div>
            <InputNumber
              min={0}
              max={99}
              value={val}
              onChange={(v) => setVal(row.id, muc, v || 0)}
              size="small"
              style={{
                width: 60,
                borderColor: isOver ? '#ff4d4f' : undefined,
              }}
            />
            <Text
              type={isOver ? 'danger' : 'secondary'}
              style={{ fontSize: 11, marginLeft: 4 }}
            >
              /{available}
            </Text>
          </div>
        );
      },
    })),
    {
      title: 'Tổng',
      key: 'total',
      width: 70,
      render: (_: any, row: any) => {
        const total = ALL_MUC_DO.reduce((s, m) => s + getVal(row.id, m), 0);
        return <Tag color="blue">{total}</Tag>;
      },
    },
  ];

  if (!monHocId) {
    return <Alert message="Vui lòng chọn Môn học trước" type="info" showIcon />;
  }

  if (relatedKKTs.length === 0) {
    return (
      <Alert
        message="Môn học chưa có Khối kiến thức liên kết"
        description="Hãy vào tab Danh mục → Môn học → Sửa để gán Khối kiến thức"
        type="warning"
        showIcon
      />
    );
  }

  return (
    <>
      <Table
        dataSource={relatedKKTs}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        bordered
        scroll={{ x: 700 }}
        footer={() => (
          <Row gutter={24}>
            <Col>
              <Statistic title="Tổng câu" value={summary.tongCau} />
            </Col>
            <Col>
              <Statistic title="Điểm (ước tính)" value={summary.tongDiem} suffix="đ" precision={1} />
            </Col>
            <Col>
              <Statistic title="Thời gian (ước tính)" value={summary.tongThoiGian} suffix="phút" />
            </Col>
          </Row>
        )}
      />
    </>
  );
};


const ExamStructureForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const deThis = useAppSelector((s) => s.deThi.deThis);

  const [monHocId, setMonHocId] = useState<string>('');
  const [matran, setMatran] = useState<MatranCell[]>([]);
  const [tenCauTruc, setTenCauTruc] = useState('');
  const [tenDeThi, setTenDeThi] = useState('');
  const [generating, setGenerating] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<ExamHeaderInfo>({
    truong: 'Trường Đại học ABC',
    khoa: 'Khoa Công nghệ thông tin',
    namHoc: '2025-2026',
    hocKy: 'I',
  });
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerForm] = Form.useForm();

  const handleSaveTemplate = () => {
    if (!monHocId) return message.warning('Chọn môn học');
    if (!tenCauTruc.trim()) return message.warning('Nhập tên cấu trúc');
    if (matran.length === 0) return message.warning('Ma trận đề trống');

    dispatch(
      dtActions.addCauTruc({
        ten: tenCauTruc.trim(),
        monHocId,
        matran,
      }),
    );
    message.success('Đã lưu template cấu trúc đề');
  };

  const handleGenerate = () => {
    if (!monHocId) return message.warning('Chọn môn học');
    if (!tenDeThi.trim()) return message.warning('Nhập tên đề thi');
    if (matran.length === 0) return message.warning('Ma trận đề trống');

    setGenerating(true);
    setTimeout(() => {
      const cauTruc = { id: '', ten: tenDeThi, monHocId, matran, createdAt: '' };
      const result = generateExam(cauTruc, cauHois, khoiKienThucs);

      if (!result.success && result.errors) {
        Modal.error({
          title: 'Không đủ câu hỏi!',
          width: 500,
          content: (
            <List
              size="small"
              dataSource={result.errors}
              renderItem={(e) => (
                <List.Item>
                  <Text type="danger">
                    <WarningOutlined /> Khối "{e.khoiKienThucTen}" — {MUC_DO_LABEL[e.mucDoKho]}:
                    cần <strong>{e.required}</strong> câu, có <strong>{e.available}</strong> câu
                  </Text>
                </List.Item>
              )}
            />
          ),
        });
      } else if (result.success && result.cauHoiIds) {
        dispatch(
          dtActions.addDeThi({
            ten: tenDeThi.trim(),
            cauTrucId: '',
            monHocId,
            cauHoiIds: result.cauHoiIds,
            tongDiem: result.tongDiem || 0,
            tongThoiGian: result.tongThoiGian || 0,
            headerInfo,
          }),
        );
        message.success(`Đã tạo đề thi "${tenDeThi}" với ${result.cauHoiIds.length} câu hỏi!`);
        setTenDeThi('');
      }
      setGenerating(false);
    }, 500);
  };

  return (
    <Card
      title={<><ThunderboltOutlined /> Cấu trúc đề thi & Tạo đề</>}
      size="small"
    >
      <Row gutter={[16, 12]}>
        <Col xs={24} md={8}>
          <Text strong>Môn học *</Text>
          <Select
            style={{ width: '100%', marginTop: 4 }}
            placeholder="Chọn môn học"
            value={monHocId || undefined}
            onChange={(v) => {
              setMonHocId(v);
              setMatran([]);
            }}
          >
            {monHocs.map((m) => (
              <Select.Option key={m.id} value={m.id}>{m.ten}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Text strong>Tên cấu trúc (template)</Text>
          <Input
            style={{ marginTop: 4 }}
            placeholder="VD: Cấu trúc đề giữa kỳ..."
            value={tenCauTruc}
            onChange={(e) => setTenCauTruc(e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Text strong>Tên đề thi *</Text>
          <Input
            style={{ marginTop: 4 }}
            placeholder="VD: Đề thi giữa kỳ 01..."
            value={tenDeThi}
            onChange={(e) => setTenDeThi(e.target.value)}
          />
        </Col>
      </Row>

      <Divider>Ma trận đề thi</Divider>
      <MatrixEditor monHocId={monHocId} matran={matran} onChange={setMatran} />

      <Divider />
      <Row gutter={12}>
        <Col>
          <Button icon={<SaveOutlined />} onClick={handleSaveTemplate}>
            Lưu Template
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {
            headerForm.setFieldsValue(headerInfo);
            setHeaderModalOpen(true);
          }}>
            📝 Thông tin đề thi
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={generating ? <LoadingOutlined /> : <ThunderboltOutlined />}
            onClick={handleGenerate}
            loading={generating}
          >
            Tạo đề thi
          </Button>
        </Col>
      </Row>

      {}
      <Modal
        title="Thông tin tiêu đề đề thi"
        visible={headerModalOpen}
        onOk={() => {
          headerForm.validateFields().then((v) => {
            setHeaderInfo(v);
            setHeaderModalOpen(false);
            message.success('Đã cập nhật thông tin');
          });
        }}
        onCancel={() => setHeaderModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={headerForm} layout="vertical">
          <Form.Item name="truong" label="Tên trường" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="khoa" label="Khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="namHoc" label="Năm học" rules={[{ required: true }]}>
                <Input placeholder="2025-2026" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hocKy" label="Học kỳ" rules={[{ required: true }]}>
                <Input placeholder="I, II" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};


interface TemplateManagerProps {
  onLoadTemplate: (ct: CauTrucDeThi) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = () => {
  const dispatch = useAppDispatch();
  const cauTrucs = useAppSelector((s) => s.deThi.cauTrucs);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const monHocMap = useMemo(() => new Map(monHocs.map((m) => [m.id, m.ten])), [monHocs]);

  if (cauTrucs.length === 0) return null;

  return (
    <Card
      title={<><FileTextOutlined /> Template cấu trúc đã lưu ({cauTrucs.length})</>}
      size="small"
      style={{ marginTop: 16 }}
    >
      <Table
        dataSource={cauTrucs}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 5, size: 'small' }}
        columns={[
          { title: 'Tên', dataIndex: 'ten', key: 'ten' },
          {
            title: 'Môn học',
            dataIndex: 'monHocId',
            key: 'mh',
            render: (id: string) => <Tag color="blue">{monHocMap.get(id) || '—'}</Tag>,
          },
          {
            title: 'Số ô ma trận',
            key: 'cells',
            width: 100,
            render: (_: any, r: CauTrucDeThi) => r.matran.length,
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'date',
            width: 150,
            render: (v: string) => <Text type="secondary">{formatDate(v)}</Text>,
          },
          {
            title: '',
            key: 'actions',
            width: 60,
            render: (_: any, r: CauTrucDeThi) => (
              <Popconfirm title="Xóa template?" onConfirm={() => dispatch(dtActions.deleteCauTruc(r.id))}>
                <Button size="small" icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ),
          },
        ]}
      />
    </Card>
  );
};


interface ExamListProps {
  onPreview: (exam: DeThi) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onPreview }) => {
  const dispatch = useAppDispatch();
  const deThis = useAppSelector((s) => s.deThi.deThis);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const monHocMap = useMemo(() => new Map(monHocs.map((m) => [m.id, m.ten])), [monHocs]);

  const [dupModalOpen, setDupModalOpen] = useState(false);
  const [dupResult, setDupResult] = useState<ReturnType<typeof checkDuplicate> | null>(null);
  const [dupA, setDupA] = useState<string>('');
  const [dupB, setDupB] = useState<string>('');

  const handleCheckDuplicate = () => {
    const examA = deThis.find((d) => d.id === dupA);
    const examB = deThis.find((d) => d.id === dupB);
    if (!examA || !examB) return message.warning('Chọn 2 đề thi');
    if (dupA === dupB) return message.warning('Chọn 2 đề thi khác nhau');
    const result = checkDuplicate(examA, examB);
    setDupResult(result);
  };

  return (
    <>
      <Card
        title={<><FileTextOutlined /> Đề thi đã tạo ({deThis.length})</>}
        size="small"
        style={{ marginTop: 16 }}
        extra={
          deThis.length >= 2 && (
            <Button icon={<CopyOutlined />} onClick={() => setDupModalOpen(true)}>
              Kiểm tra trùng lặp
            </Button>
          )
        }
      >
        {deThis.length === 0 ? (
          <Empty description="Chưa có đề thi nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Table
            dataSource={deThis}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, size: 'small' }}
            columns={[
              { title: 'Tên đề', dataIndex: 'ten', key: 'ten' },
              {
                title: 'Môn học',
                dataIndex: 'monHocId',
                key: 'mh',
                render: (id: string) => <Tag color="blue">{monHocMap.get(id) || '—'}</Tag>,
              },
              {
                title: 'Số câu',
                key: 'count',
                width: 75,
                render: (_: any, r: DeThi) => <Tag>{r.cauHoiIds.length}</Tag>,
              },
              {
                title: 'Tổng điểm',
                dataIndex: 'tongDiem',
                key: 'diem',
                width: 85,
                render: (v: number) => <Text strong>{v}đ</Text>,
              },
              {
                title: 'Thời gian',
                dataIndex: 'tongThoiGian',
                key: 'time',
                width: 85,
                render: (v: number) => `${v} phút`,
              },
              {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'date',
                width: 140,
                render: (v: string) => <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(v)}</Text>,
              },
              {
                title: 'Thao tác',
                key: 'actions',
                width: 100,
                render: (_: any, r: DeThi) => (
                  <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => onPreview(r)} />
                    <Popconfirm
                      title="Xóa đề thi?"
                      onConfirm={() => {
                        dispatch(dtActions.deleteDeThi(r.id));
                        message.success('Đã xóa');
                      }}
                    >
                      <Button size="small" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>

      {}
      <Modal
        title="Kiểm tra trùng lặp giữa 2 đề thi"
        visible={dupModalOpen}
        onCancel={() => {
          setDupModalOpen(false);
          setDupResult(null);
        }}
        footer={null}
        width={600}
      >
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col span={10}>
            <Select
              style={{ width: '100%' }}
              placeholder="Đề thi A"
              value={dupA || undefined}
              onChange={setDupA}
            >
              {deThis.map((d) => (
                <Select.Option key={d.id} value={d.id}>{d.ten}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={10}>
            <Select
              style={{ width: '100%' }}
              placeholder="Đề thi B"
              value={dupB || undefined}
              onChange={setDupB}
            >
              {deThis.map((d) => (
                <Select.Option key={d.id} value={d.id}>{d.ten}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleCheckDuplicate} block>
              So sánh
            </Button>
          </Col>
        </Row>

        {dupResult && (
          <div>
            <Alert
              type={dupResult.percentA > 30 ? 'error' : dupResult.percentA > 0 ? 'warning' : 'success'}
              message={
                dupResult.commonIds.length === 0
                  ? '✅ Không có câu hỏi trùng lặp!'
                  : `⚠️ Có ${dupResult.commonIds.length} câu hỏi trùng lặp`
              }
              showIcon
            />
            {dupResult.commonIds.length > 0 && (
              <Descriptions column={1} size="small" style={{ marginTop: 12 }} bordered>
                <Descriptions.Item label="Câu trùng">{dupResult.commonIds.length}</Descriptions.Item>
                <Descriptions.Item label="% so với Đề A">
                  <Tag color={dupResult.percentA > 30 ? 'red' : 'green'}>{dupResult.percentA}%</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="% so với Đề B">
                  <Tag color={dupResult.percentB > 30 ? 'red' : 'green'}>{dupResult.percentB}%</Tag>
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};


const DeThiTab: React.FC<{ onPreview: (exam: DeThi) => void }> = ({ onPreview }) => (
  <div>
    <ExamStructureForm />
    <TemplateManager onLoadTemplate={() => {}} />
    <ExamList onPreview={onPreview} />
  </div>
);

export default DeThiTab;
