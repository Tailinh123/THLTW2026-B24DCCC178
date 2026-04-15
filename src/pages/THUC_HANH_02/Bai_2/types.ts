/* ============================================================
 * THUC_HANH_01 — Bài 2: Exam System Types
 * Type definitions for Question Bank & Exam Management
 * ============================================================ */

/* ===== Danh mục ===== */

export interface KhoiKienThuc {
  id: string;
  ten: string;
  moTa: string;
}

export interface MonHoc {
  id: string;
  ten: string;
  moTa: string;
  khoiKienThucIds: string[];
}

/* ===== Câu hỏi ===== */

export type MucDoKho = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export const MUC_DO_LABEL: Record<MucDoKho, string> = {
  nhan_biet: 'Nhận biết',
  thong_hieu: 'Thông hiểu',
  van_dung: 'Vận dụng',
  van_dung_cao: 'Vận dụng cao',
};

export const MUC_DO_COLOR: Record<MucDoKho, string> = {
  nhan_biet: '#52c41a',
  thong_hieu: '#1890ff',
  van_dung: '#fa8c16',
  van_dung_cao: '#ff4d4f',
};

export const ALL_MUC_DO: MucDoKho[] = ['nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao'];

export interface CauHoi {
  id: string;
  noiDung: string;
  dapAn: string;
  monHocId: string;
  khoiKienThucId: string;
  mucDoKho: MucDoKho;
  diem: number;
  thoiGianPhut: number;
  chuong: string;
  baiHoc: string;
  createdAt: string;
  updatedAt: string;
}

/* ===== Đề thi ===== */

export interface MatranCell {
  khoiKienThucId: string;
  mucDoKho: MucDoKho;
  soLuong: number;
}

export interface CauTrucDeThi {
  id: string;
  ten: string;
  monHocId: string;
  matran: MatranCell[];
  createdAt: string;
}

export interface ExamHeaderInfo {
  truong: string;
  khoa: string;
  namHoc: string;
  hocKy: string;
}

export interface DeThi {
  id: string;
  ten: string;
  cauTrucId: string;
  monHocId: string;
  cauHoiIds: string[];
  tongDiem: number;
  tongThoiGian: number;
  headerInfo: ExamHeaderInfo;
  createdAt: string;
}

/* ===== Filter ===== */

export interface CauHoiFilter {
  monHocId?: string;
  khoiKienThucId?: string;
  mucDoKho?: MucDoKho;
  keyword?: string;
  diemMin?: number;
  diemMax?: number;
}

/* ===== Exam Generation ===== */

export interface ExamGenError {
  khoiKienThucId: string;
  khoiKienThucTen: string;
  mucDoKho: MucDoKho;
  required: number;
  available: number;
}

export interface ExamGenResult {
  success: boolean;
  cauHoiIds?: string[];
  errors?: ExamGenError[];
  tongDiem?: number;
  tongThoiGian?: number;
}
