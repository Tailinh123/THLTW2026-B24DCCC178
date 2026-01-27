/* ============================================================
 * THUC_HANH_02 — Bài 2: Tab Đề Thi
 * Modernized with Steps Component for Exam Generation
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
  Alert,
  Divider,
  Statistic,
  Descriptions,
  List,
  Steps,
  Result,
} from 'antd';
import {
  DeleteOutlined,
  ThunderboltOutlined,
  SaveOutlined,
  FileTextOutlined,
  EyeOutlined,
  WarningOutlined,
  CopyOutlined,
  LoadingOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { dtActions } from '../slices';
import type { MatranCell, MucDoKho, CauTrucDeThi, DeThi, ExamHeaderInfo } from '../types';
import { MUC_DO_LABEL, ALL_MUC_DO } from '../types';
import { generateExam, calcMatranSummary, checkDuplicate } from '../utils';
import { formatDate } from '../../common';

const { Text, Title } = Typography;
const { Step } = Steps;

/* Custom Badge Colors based on difficulty */
const BADGE_COLORS: Record<MucDoKho, string> = {
  nhan_biet: 'green',
  thong_hieu: 'blue',
  van_dung: 'orange',
  van_dung_cao: 'red',
};

/* =============================================================
 * 1. EXAM MATRIX TABLE — Bảng ma trận cấu trúc đề
 * ============================================================= */
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
      width: 200,
      fixed: 'left' as const,
      render: (v: string) => <Text strong style={{ color: '#262626' }}>{v}</Text>,
    },
    ...ALL_MUC_DO.map((muc) => ({
      title: (
        <span style={{ color: BADGE_COLORS[muc] }}>
          {MUC_DO_LABEL[muc]}
        </span>
      ),
      key: muc,
      width: 140,
      align: 'center' as const,
      render: (_: any, row: any) => {
        const available = getAvailable(row.id, muc);
        const val = getVal(row.id, muc);
        const isOver = val > available;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <InputNumber
              min={0}
              max={99}
              value={val}
              onChange={(v) => setVal(row.id, muc, v || 0)}
              size="middle"
              style={{
                width: 60,
                borderColor: isOver ? '#ff4d4f' : undefined,
                backgroundColor: isOver ? '#fff1f0' : undefined,
              }}
            />
            <Text
              type={isOver ? 'danger' : 'secondary'}
              style={{ fontSize: 12 }}
            >
              / {available}
            </Text>
          </div>
        );
      },
    })),
    {
      title: 'Tổng',
      key: 'total',
      width: 80,
      align: 'center' as const,
      render: (_: any, row: any) => {
        const total = ALL_MUC_DO.reduce((s, m) => s + getVal(row.id, m), 0);
        return <Tag color="blue" style={{ borderRadius: 10 }}>{total}</Tag>;
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
    <div style={{ marginTop: 16 }}>
      <Table
        dataSource={relatedKKTs}
        columns={columns}
        rowKey="id"
        size="middle"
        pagination={false}
        bordered
        scroll={{ x: 800 }}
      />
      <div style={{ background: '#fafbfc', padding: '16px 24px', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
        <Row gutter={48} justify="end">
          <Col>
            <Statistic title="Tổng số câu hỏi" value={summary.tongCau} valueStyle={{ color: '#1890ff', fontWeight: 600 }} />
          </Col>
          <Col>
            <Statistic title="Điểm ước tính" value={summary.tongDiem} suffix="đ" precision={1} valueStyle={{ color: '#fa8c16', fontWeight: 600 }} />
          </Col>
          <Col>
            <Statistic title="Thời gian ước tính" value={summary.tongThoiGian} suffix="phút" valueStyle={{ color: '#52c41a', fontWeight: 600 }} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

/* =============================================================
 * 2. EXAM STRUCTURE STEPS — Quy trình tạo đề thi
 * ============================================================= */
const ExamGeneratorSteps: React.FC = () => {
  const dispatch = useAppDispatch();
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const khoiKienThucs = useAppSelector((s) => s.danhMuc.khoiKienThucs);
  const cauHois = useAppSelector((s) => s.cauHoi.items);

  const [currentStep, setCurrentStep] = useState(0);
  const [monHocId, setMonHocId] = useState<string>('');
  const [matran, setMatran] = useState<MatranCell[]>([]);
  const [tenDeThi, setTenDeThi] = useState('');
  const [generating, setGenerating] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<ExamHeaderInfo>({
    truong: 'Trường Đại học ABC',
    khoa: 'Khoa Công nghệ thông tin',
    namHoc: '2025-2026',
    hocKy: 'I',
  });
  
  const [headerForm] = Form.useForm();
  
  const handleNextStep1 = () => {
    if (!monHocId) {
      message.warning('Vui lòng chọn môn học để tiếp tục');
      return;
    }
    setCurrentStep(1);
  };

  const handleNextStep2 = () => {
    if (matran.length === 0) {
      message.warning('Vui lòng nhập số lượng câu hỏi vào ma trận đề');
      return;
    }
    headerForm.setFieldsValue(headerInfo);
    setCurrentStep(2);
  };

  const handleGenerate = () => {
    if (!tenDeThi.trim()) {
      message.warning('Vui lòng nhập tên đề thi');
      return;
    }

    headerForm.validateFields().then((v) => {
      setHeaderInfo(v);
      setGenerating(true);
      
      setTimeout(() => {
        const cauTruc = { id: '', ten: tenDeThi, monHocId, matran, createdAt: '' };
        const result = generateExam(cauTruc, cauHois, khoiKienThucs);

        if (!result.success && result.errors) {
          Modal.error({
            title: 'Không đủ câu hỏi trong ngân hàng!',
            width: 500,
            content: (
              <List
                size="small"
                dataSource={result.errors}
                renderItem={(e) => (
                  <List.Item>
                    <Text type="danger">
                      <WarningOutlined style={{ marginRight: 8 }}/> Khối "{e.khoiKienThucTen}" — {MUC_DO_LABEL[e.mucDoKho]}:
                      cần <strong>{e.required}</strong> câu, có <strong>{e.available}</strong> câu
                    </Text>
                  </List.Item>
                )}
              />
            ),
          });
          setGenerating(false);
        } else if (result.success && result.cauHoiIds) {
          dispatch(
            dtActions.addDeThi({
              ten: tenDeThi.trim(),
              cauTrucId: '',
              monHocId,
              cauHoiIds: result.cauHoiIds,
              tongDiem: result.tongDiem || 0,
              tongThoiGian: result.tongThoiGian || 0,
              headerInfo: v,
            }),
          );
          Modal.success({
            title: 'Tạo đề thi thành công!',
            content: `Đã tạo đề thi "${tenDeThi}" với ${result.cauHoiIds.length} câu hỏi. Đề thi đã được lưu vào danh sách bên dưới.`,
            onOk: () => {
              setCurrentStep(0);
              setMonHocId('');
              setMatran([]);
              setTenDeThi('');
            }
          });
          setGenerating(false);
        }
      }, 800);
    }).catch(() => {
      message.error('Vui lòng kiểm tra lại thông tin tiêu đề');
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
            <BookOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 24, opacity: 0.8 }} />
            <Title level={4}>Chọn môn học để tạo đề</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Hệ thống sẽ lấy các khối kiến thức liên kết với môn học này</Text>
            <Select
              style={{ width: '100%', textAlign: 'left' }}
              placeholder="Vui lòng chọn môn học"
              size="large"
              value={monHocId || undefined}
              onChange={(v) => {
                setMonHocId(v);
                setMatran([]);
              }}
              options={monHocs.map(m => ({ label: m.ten, value: m.id }))}
            />
            <Button type="primary" size="large" style={{ marginTop: 32, padding: '0 40px', borderRadius: 8 }} onClick={handleNextStep1}>
              Tiếp tục <ArrowRightOutlined />
            </Button>
          </div>
        );
      case 1:
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Title level={5} style={{ margin: 0 }}>Cấu hình Ma trận Đề thi</Title>
                <Text type="secondary">Nhập số lượng câu hỏi tương ứng cho từng mức độ và khối kiến thức</Text>
              </div>
              <Button icon={<SaveOutlined />} onClick={() => {
                if(matran.length > 0) {
                  dispatch(dtActions.addCauTruc({ ten: `Template ${monHocs.find(m=>m.id===monHocId)?.ten} ${new Date().getTime()}`, monHocId, matran }));
                  message.success('Đã lưu cấu trúc thành template');
                } else message.warning('Ma trận trống');
              }}>Lưu Template</Button>
            </div>
            
            <MatrixEditor monHocId={monHocId} matran={matran} onChange={setMatran} />
            
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Button size="large" onClick={() => setCurrentStep(0)} icon={<ArrowLeftOutlined />} style={{ borderRadius: 8 }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={handleNextStep2} style={{ padding: '0 40px', borderRadius: 8 }}>
                Tiếp tục cấu hình <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        );
      case 2:
        const summary = calcMatranSummary(matran, cauHois, monHocId);
        return (
          <Row gutter={32}>
            <Col xs={24} md={12}>
              <Card title={<><SettingOutlined /> Thông tin tiêu đề</>} size="small" bordered style={{ background: '#fafbfc' }}>
                <Form form={headerForm} layout="vertical" initialValues={headerInfo}>
                  <Form.Item label="Tên đề thi" required>
                    <Input placeholder="VD: Đề thi Giữa kỳ 1..." size="large" value={tenDeThi} onChange={e => setTenDeThi(e.target.value)} />
                  </Form.Item>
                  <Form.Item name="truong" label="Tên trường" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="khoa" label="Khoa" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="namHoc" label="Năm học" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="hocKy" label="Học kỳ" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={<><FileTextOutlined /> Tổng quan cấu trúc</>} size="small" bordered style={{ height: '100%' }}>
                <Result
                  icon={<ThunderboltOutlined style={{ color: '#1890ff' }}/>}
                  title="Sẵn sàng tạo đề thi ngẫu nhiên"
                  subTitle={
                    <div style={{ marginTop: 16, textAlign: 'left' }}>
                      <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Môn học"><strong>{monHocs.find(m=>m.id===monHocId)?.ten}</strong></Descriptions.Item>
                        <Descriptions.Item label="Tổng số câu"><strong>{summary.tongCau} câu</strong></Descriptions.Item>
                        <Descriptions.Item label="Ước tính điểm"><strong>{summary.tongDiem} đ</strong></Descriptions.Item>
                        <Descriptions.Item label="Thời gian"><strong>{summary.tongThoiGian} phút</strong></Descriptions.Item>
                      </Descriptions>
                    </div>
                  }
                  extra={[
                    <Button key="back" onClick={() => setCurrentStep(1)} style={{ borderRadius: 6 }}>
                      Sửa ma trận
                    </Button>,
                    <Button key="generate" type="primary" size="large" onClick={handleGenerate} loading={generating} style={{ borderRadius: 6 }}>
                      {generating ? 'Đang tạo đề...' : 'Tạo Đề Thi Ngay'}
                    </Button>,
                  ]}
                />
              </Card>
            </Col>
          </Row>
        );
      default: return null;
    }
  };

  return (
    <div className="exam-steps-wrapper">
      <Steps current={currentStep} style={{ maxWidth: 800, margin: '0 auto' }}>
        <Step title="Môn học" description="Chọn môn học" />
        <Step title="Cấu trúc ma trận" description="Nhập số lượng câu" />
        <Step title="Tạo đề" description="Hoàn thiện tiêu đề" />
      </Steps>
      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

/* =============================================================
 * 3. TEMPLATE MANAGER — Quản lý cấu trúc đã lưu
 * ============================================================= */
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
      bordered={false}
      title={<><SaveOutlined style={{ color: '#52c41a', marginRight: 8 }}/> Các mẫu ma trận đã lưu ({cauTrucs.length})</>}
      style={{ marginBottom: 24 }}
    >
      <Table
        dataSource={cauTrucs}
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        columns={[
          { title: 'Tên mẫu cấu trúc', dataIndex: 'ten', key: 'ten', render: (t) => <strong>{t}</strong> },
          {
            title: 'Môn học',
            dataIndex: 'monHocId',
            key: 'mh',
            render: (id: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{monHocMap.get(id) || '—'}</Tag>,
          },
          {
            title: 'Chi tiết',
            key: 'cells',
            width: 150,
            render: (_: any, r: CauTrucDeThi) => <span style={{ color: '#595959' }}>{r.matran.length} ô ma trận</span>,
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'date',
            width: 180,
            render: (v: string) => <Text type="secondary">{formatDate(v)}</Text>,
          },
          {
            title: '',
            key: 'actions',
            width: 80,
            align: 'center' as const,
            render: (_: any, r: CauTrucDeThi) => (
              <Popconfirm title="Bạn có chắc muốn xóa template này?" onConfirm={() => dispatch(dtActions.deleteCauTruc(r.id))} okText="Xóa" cancelText="Hủy">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ),
          },
        ]}
      />
    </Card>
  );
};

/* =============================================================
 * 4. EXAM LIST — Danh sách đề thi đã tạo + Duplicate Check
 * ============================================================= */
interface ExamListProps {
  onPreview: (exam: DeThi) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onPreview }) => {
  const dispatch = useAppDispatch();
  const deThis = useAppSelector((s) => s.deThi.deThis);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const monHocMap = useMemo(() => new Map(monHocs.map((m) => [m.id, m.ten])), [monHocs]);

  const [dupModalOpen, setDupModalOpen] = useState(false);
  const [dupResult, setDupResult] = useState<ReturnType<typeof checkDuplicate> | null>(null);
  const [dupA, setDupA] = useState<string>('');
  const [dupB, setDupB] = useState<string>('');

  const handleCheckDuplicate = () => {
    const examA = deThis.find((d) => d.id === dupA);
    const examB = deThis.find((d) => d.id === dupB);
    if (!examA || !examB) return message.warning('Vui lòng chọn 2 đề thi');
    if (dupA === dupB) return message.warning('Vui lòng chọn 2 đề thi khác nhau');
    const result = checkDuplicate(examA, examB);
    setDupResult(result);
  };

  return (
    <>
      <Card
        bordered={false}
        title={<><FileTextOutlined style={{ color: '#1890ff', marginRight: 8 }}/> Danh sách đề thi ({deThis.length})</>}
        extra={
          deThis.length >= 2 && (
            <Button icon={<CopyOutlined />} onClick={() => setDupModalOpen(true)} style={{ borderRadius: 6 }}>
              Công cụ kiểm tra trùng lặp
            </Button>
          )
        }
      >
        {deThis.length === 0 ? (
          <Empty description="Chưa có đề thi nào được tạo" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '40px 0' }}/>
        ) : (
          <Table
            dataSource={deThis}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            columns={[
              { title: 'Tên đề thi', dataIndex: 'ten', key: 'ten', render: (t) => <strong style={{ color: '#262626' }}>{t}</strong> },
              {
                title: 'Môn học',
                dataIndex: 'monHocId',
                key: 'mh',
                render: (id: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{monHocMap.get(id) || '—'}</Tag>,
              },
              {
                title: 'Tổng số câu',
                key: 'count',
                width: 120,
                align: 'center' as const,
                render: (_: any, r: DeThi) => <Tag style={{ borderRadius: 10, padding: '0 8px' }}>{r.cauHoiIds.length} câu</Tag>,
              },
              {
                title: 'Tổng điểm',
                dataIndex: 'tongDiem',
                key: 'diem',
                width: 100,
                align: 'center' as const,
                render: (v: number) => <strong style={{ color: '#fa8c16' }}>{v}đ</strong>,
              },
              {
                title: 'Thời gian',
                dataIndex: 'tongThoiGian',
                key: 'time',
                width: 120,
                render: (v: number) => <span>{v} phút</span>,
              },
              {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'date',
                width: 150,
                render: (v: string) => <Text type="secondary" style={{ fontSize: 13 }}>{formatDate(v)}</Text>,
              },
              {
                title: 'Thao tác',
                key: 'actions',
                width: 120,
                align: 'center' as const,
                render: (_: any, r: DeThi) => (
                  <Space size="small">
                    <Tooltip title="Xem chi tiết đề thi">
                      <Button type="text" style={{ color: '#1890ff' }} icon={<EyeOutlined />} onClick={() => onPreview(r)} />
                    </Tooltip>
                    <Popconfirm
                      title="Xóa đề thi này?"
                      onConfirm={() => {
                        dispatch(dtActions.deleteDeThi(r.id));
                        message.success('Đã xóa đề thi');
                      }}
                      okText="Xóa"
                      cancelText="Hủy"
                      placement="topRight"
                    >
                      <Tooltip title="Xóa đề thi">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Duplicate Checker Modal */}
      <Modal
        title={<div style={{ fontSize: 16, fontWeight: 600 }}>Kiểm tra trùng lặp giữa 2 đề thi</div>}
        visible={dupModalOpen}
        onCancel={() => {
          setDupModalOpen(false);
          setDupResult(null);
        }}
        footer={null}
        width={650}
        centered
      >
        <div style={{ padding: '8px 0' }}>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={10}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Đề thi thứ nhất</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn đề A"
                size="large"
                value={dupA || undefined}
                onChange={setDupA}
                options={deThis.map(d => ({ label: d.ten, value: d.id }))}
              />
            </Col>
            <Col span={10}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Đề thi thứ hai</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn đề B"
                size="large"
                value={dupB || undefined}
                onChange={setDupB}
                options={deThis.map(d => ({ label: d.ten, value: d.id }))}
              />
            </Col>
            <Col span={4}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <Button type="primary" onClick={handleCheckDuplicate} size="large" block style={{ borderRadius: 8 }}>
                  Kiểm tra
                </Button>
              </div>
            </Col>
          </Row>

          {dupResult && (
            <div style={{ marginTop: 24, padding: 20, background: '#fafbfc', borderRadius: 8, border: '1px solid #f0f0f0' }}>
              <Alert
                type={dupResult.percentA > 30 ? 'error' : dupResult.percentA > 0 ? 'warning' : 'success'}
                message={
                  dupResult.commonIds.length === 0
                    ? '✅ An toàn! Không có câu hỏi nào bị trùng lặp.'
                    : `⚠️ Phát hiện ${dupResult.commonIds.length} câu hỏi trùng lặp.`
                }
                showIcon
                style={{ marginBottom: 16, fontSize: 15 }}
              />
              {dupResult.commonIds.length > 0 && (
                <Descriptions column={2} size="middle" bordered style={{ background: '#fff' }}>
                  <Descriptions.Item label="Số câu trùng"><strong>{dupResult.commonIds.length} câu</strong></Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">{dupResult.percentA > 30 ? <Tag color="red">Trùng lặp cao</Tag> : <Tag color="warning">Chấp nhận được</Tag>}</Descriptions.Item>
                  <Descriptions.Item label="% so với Đề A">
                    <span style={{ color: dupResult.percentA > 30 ? '#cf1322' : '#389e0d', fontWeight: 600 }}>{dupResult.percentA}%</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="% so với Đề B">
                    <span style={{ color: dupResult.percentB > 30 ? '#cf1322' : '#389e0d', fontWeight: 600 }}>{dupResult.percentB}%</span>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

/* =============================================================
 * MAIN EXPORT — Tab Đề Thi
 * ============================================================= */
import { BookOutlined } from '@ant-design/icons';
const DeThiTab: React.FC<{ onPreview: (exam: DeThi) => void }> = ({ onPreview }) => (
  <div>
    <ExamGeneratorSteps />
    <TemplateManager onLoadTemplate={() => {}} />
    <ExamList onPreview={onPreview} />
  </div>
);

export default DeThiTab;
