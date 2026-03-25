export interface SoVanBang {
  id: string;
  nam: number;
  soHienTai: number;
}

export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: string;
  trichYeu: string;
  luotTraCuu: number;
}

export type KieuDuLieu = 'String' | 'Number' | 'Date';

export interface CauHinhTruong {
  id: string;
  tenTruong: string;
  kieuDuLieu: KieuDuLieu;
}

export interface VanBang {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string;
  soVanBangId: string;
  quyetDinhId: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  truongBoSung: Record<string, any>;
}

export type PageKey = 'so-van-bang' | 'quyet-dinh' | 'cau-hinh' | 'van-bang' | 'tra-cuu';

const uid = () => Math.random().toString(36).slice(2, 9);
export const genId = () => `id_${uid()}`;

export const MOCK_SO_VAN_BANG: SoVanBang[] = [
  { id: 'svb_1', nam: 2023, soHienTai: 3 },
  { id: 'svb_2', nam: 2024, soHienTai: 2 },
];

export const MOCK_QUYET_DINH: QuyetDinhTotNghiep[] = [
  { id: 'qd_1', soQuyetDinh: 'QĐ-001/2023', ngayBanHanh: '2023-06-15', trichYeu: 'Về việc công nhận tốt nghiệp đại học chính quy đợt 1 năm 2023', luotTraCuu: 0 },
  { id: 'qd_2', soQuyetDinh: 'QĐ-002/2023', ngayBanHanh: '2023-12-20', trichYeu: 'Về việc công nhận tốt nghiệp đại học chính quy đợt 2 năm 2023', luotTraCuu: 0 },
  { id: 'qd_3', soQuyetDinh: 'QĐ-001/2024', ngayBanHanh: '2024-06-18', trichYeu: 'Về việc công nhận tốt nghiệp đại học chính quy đợt 1 năm 2024', luotTraCuu: 0 },
];

export const MOCK_CAU_HINH: CauHinhTruong[] = [
  { id: 'ct_1', tenTruong: 'Nơi sinh', kieuDuLieu: 'String' },
  { id: 'ct_2', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
  { id: 'ct_3', tenTruong: 'Xếp loại', kieuDuLieu: 'String' },
  { id: 'ct_4', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' },
  { id: 'ct_5', tenTruong: 'Ngày cấp bằng', kieuDuLieu: 'Date' },
];

export const MOCK_VAN_BANG: VanBang[] = [
  {
    id: 'vb_1', soVaoSo: 1, soHieuVanBang: 'VB-2023-001',
    soVanBangId: 'svb_1', quyetDinhId: 'qd_1',
    maSinhVien: 'B20DCCN001', hoTen: 'Nguyễn Văn An', ngaySinh: '2002-03-15',
    truongBoSung: { 'Nơi sinh': 'Hà Nội', 'Dân tộc': 'Kinh', 'Xếp loại': 'Giỏi', 'Điểm trung bình': 3.45, 'Ngày cấp bằng': '2023-07-01' },
  },
  {
    id: 'vb_2', soVaoSo: 2, soHieuVanBang: 'VB-2023-002',
    soVanBangId: 'svb_1', quyetDinhId: 'qd_1',
    maSinhVien: 'B20DCCN002', hoTen: 'Trần Thị Bích', ngaySinh: '2002-07-22',
    truongBoSung: { 'Nơi sinh': 'Hải Phòng', 'Dân tộc': 'Kinh', 'Xếp loại': 'Xuất sắc', 'Điểm trung bình': 3.82, 'Ngày cấp bằng': '2023-07-01' },
  },
  {
    id: 'vb_3', soVaoSo: 3, soHieuVanBang: 'VB-2023-003',
    soVanBangId: 'svb_1', quyetDinhId: 'qd_2',
    maSinhVien: 'B20DCCN003', hoTen: 'Lê Hoàng Cường', ngaySinh: '2001-11-08',
    truongBoSung: { 'Nơi sinh': 'Đà Nẵng', 'Dân tộc': 'Kinh', 'Xếp loại': 'Khá', 'Điểm trung bình': 3.12, 'Ngày cấp bằng': '2023-12-28' },
  },
  {
    id: 'vb_4', soVaoSo: 1, soHieuVanBang: 'VB-2024-001',
    soVanBangId: 'svb_2', quyetDinhId: 'qd_3',
    maSinhVien: 'B20DCCN004', hoTen: 'Phạm Minh Đức', ngaySinh: '2002-01-30',
    truongBoSung: { 'Nơi sinh': 'TP. Hồ Chí Minh', 'Dân tộc': 'Kinh', 'Xếp loại': 'Giỏi', 'Điểm trung bình': 3.55, 'Ngày cấp bằng': '2024-07-05' },
  },
  {
    id: 'vb_5', soVaoSo: 2, soHieuVanBang: 'VB-2024-002',
    soVanBangId: 'svb_2', quyetDinhId: 'qd_3',
    maSinhVien: 'B20DCCN005', hoTen: 'Hoàng Thị Evy', ngaySinh: '2002-09-12',
    truongBoSung: { 'Nơi sinh': 'Nghệ An', 'Dân tộc': 'Kinh', 'Xếp loại': 'Xuất sắc', 'Điểm trung bình': 3.90, 'Ngày cấp bằng': '2024-07-05' },
  },
];
