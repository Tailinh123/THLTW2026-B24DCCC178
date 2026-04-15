/* ============================================================
 * THUC_HANH_01 — Bài 2: Exam Preview
 * Print-friendly exam paper preview (simulating A4 paper)
 * ============================================================ */
import React, { useMemo, useRef } from 'react';
import { Modal, Button, Typography, Divider, Tag, Space, Empty } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store';
import type { DeThi, MucDoKho } from '../types';
import { MUC_DO_LABEL } from '../types';

const { Title, Text, Paragraph } = Typography;

/* =============================================================
 * EXAM PREVIEW COMPONENT
 * ============================================================= */
interface ExamPreviewProps {
  exam: DeThi | null;
  visible: boolean;
  onClose: () => void;
}

const ExamPreview: React.FC<ExamPreviewProps> = ({ exam, visible, onClose }) => {
  const cauHois = useAppSelector((s) => s.cauHoi.items);
  const monHocs = useAppSelector((s) => s.danhMuc.monHocs);
  const printRef = useRef<HTMLDivElement>(null);

  const questions = useMemo(() => {
    if (!exam) return [];
    return exam.cauHoiIds
      .map((id) => cauHois.find((c) => c.id === id))
      .filter(Boolean) as typeof cauHois;
  }, [exam, cauHois]);

  const monHocTen = useMemo(() => {
    if (!exam) return '';
    return monHocs.find((m) => m.id === exam.monHocId)?.ten || '';
  }, [exam, monHocs]);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${exam?.ten || 'Đề thi'}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.6;
            color: #000;
          }
          .exam-header { text-align: center; margin-bottom: 20px; }
          .exam-header-top { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .exam-header-left, .exam-header-right { text-align: center; width: 48%; }
          .exam-header-left { font-size: 12pt; }
          .exam-header-right { font-size: 12pt; }
          .exam-title { font-size: 16pt; font-weight: bold; text-align: center; margin: 16px 0 8px; text-transform: uppercase; }
          .exam-subtitle { font-size: 13pt; text-align: center; margin-bottom: 5px; }
          .exam-info { font-style: italic; text-align: center; margin-bottom: 20px; font-size: 12pt; }
          .exam-line { border-top: 1px solid #000; margin: 10px auto; width: 40%; }
          .question { margin-bottom: 16px; page-break-inside: avoid; }
          .question-header { font-weight: bold; margin-bottom: 4px; }
          .question-content { margin-left: 8px; white-space: pre-wrap; }
          .exam-footer { margin-top: 30px; text-align: center; font-style: italic; border-top: 1px solid #ccc; padding-top: 10px; font-size: 11pt; }
          .exam-summary { text-align: right; font-style: italic; margin: 20px 0 10px; font-size: 12pt; }
          hr { border: none; border-top: 1px dashed #999; margin: 12px 0; }
        </style>
      </head>
      <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (!exam) return null;

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      width={820}
      footer={
        <Space>
          <Button icon={<PrinterOutlined />} type="primary" onClick={handlePrint}>
            In đề thi
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Đóng
          </Button>
        </Space>
      }
      bodyStyle={{ padding: 0 }}
    >
      {/* On-screen Preview */}
      <div
        style={{
          maxHeight: '75vh',
          overflow: 'auto',
          padding: '0 24px',
        }}
      >
        <div
          ref={printRef}
          style={{
            background: '#fff',
            padding: '40px',
            fontFamily: "'Times New Roman', serif",
            color: '#000',
            lineHeight: 1.7,
            maxWidth: 700,
            margin: '20px auto',
            border: '1px solid #e8e8e8',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div className="exam-header">
            <div className="exam-header-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', width: '48%' }}>
                <div style={{ fontWeight: 'bold', fontSize: 13 }}>{exam.headerInfo.truong.toUpperCase()}</div>
                <div style={{ fontSize: 13 }}>{exam.headerInfo.khoa}</div>
                <div style={{ borderTop: '1px solid #000', width: '40%', margin: '4px auto' }}></div>
              </div>
              <div style={{ textAlign: 'center', width: '48%' }}>
                <div style={{ fontWeight: 'bold', fontSize: 13 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style={{ fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
                <div style={{ borderTop: '1px solid #000', width: '40%', margin: '4px auto' }}></div>
              </div>
            </div>

            <div style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, textTransform: 'uppercase' }}>
              ĐỀ THI MÔN: {monHocTen}
            </div>
            <div style={{ fontSize: 13 }}>
              Năm học: {exam.headerInfo.namHoc} — Học kỳ: {exam.headerInfo.hocKy}
            </div>
            <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 4 }}>
              Thời gian làm bài: {exam.tongThoiGian} phút | {questions.length} câu — Tổng điểm: {exam.tongDiem}đ
            </div>
            <div style={{ borderTop: '2px solid #000', margin: '12px 0' }}></div>
          </div>

          {/* Questions */}
          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Không tìm thấy câu hỏi
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="question" style={{ marginBottom: 16, pageBreakInside: 'avoid' }}>
                <div className="question-header" style={{ fontWeight: 'bold' }}>
                  Câu {idx + 1} ({q.diem} điểm){q.thoiGianPhut ? ` [${q.thoiGianPhut} phút]` : ''}:
                </div>
                <div className="question-content" style={{ marginLeft: 8, whiteSpace: 'pre-wrap' }}>
                  {q.noiDung}
                </div>
                {idx < questions.length - 1 && (
                  <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '12px 0' }} />
                )}
              </div>
            ))
          )}

          {/* Footer */}
          <div
            className="exam-footer"
            style={{
              marginTop: 30,
              textAlign: 'right',
              fontStyle: 'italic',
              borderTop: '1px solid #ccc',
              paddingTop: 10,
              fontSize: 12,
            }}
          >
            Tổng: {questions.length} câu — {exam.tongDiem} điểm — {exam.tongThoiGian} phút
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, fontStyle: 'italic', color: '#999' }}>
            — Hết —
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExamPreview;
