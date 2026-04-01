export type TrangThaiDon = 'Pending' | 'Approved' | 'Rejected';
export type GioiTinh = 'Nam' | 'Nữ' | 'Khác';
export type PageKey = 'dashboard' | 'clubs' | 'memberships' | 'members';

export interface CauLacBo {
  id: string;
  tenCLB: string;
  ngayThanhLap: string;
  moTa: string;
  chuNhiem: string;
  hoatDong: boolean;
  anhDaiDien: string;
}

export interface DonDangKy {
  id: string;
  hoTen: string;
  email: string;
  sdt: string;
  gioiTinh: GioiTinh;
  diaChi: string;
  soTruong: string;
  clubId: string;
  lyDo: string;
  trangThai: TrangThaiDon;
  ghiChu: string;
  lyDoTuChoi?: string;
  ngayDangKy: string;
}

export interface LichSuThaoTac {
  id: string;
  thoiGian: string;
  thaoTac: string;
  doiTuong: string;
  ghiChu: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);
export const genId = () => `id_${uid()}`;

const CLUBS_KEY = 'th05_clubs';
const MEMBERSHIPS_KEY = 'th05_memberships';
const HISTORY_KEY = 'th05_history';

export const MOCK_CLUBS: CauLacBo[] = [
  { id: 'clb_1', tenCLB: 'CLB Lập trình', ngayThanhLap: '2020-09-01', moTa: '<p>Câu lạc bộ <strong>lập trình</strong> dành cho sinh viên yêu thích công nghệ và phần mềm.</p>', chuNhiem: 'Nguyễn Văn Anh', hoatDong: true, anhDaiDien: 'https://placehold.co/80x80/1677ff/fff?text=LP' },
  { id: 'clb_2', tenCLB: 'CLB Âm nhạc', ngayThanhLap: '2019-03-15', moTa: '<p>Câu lạc bộ <strong>âm nhạc</strong> nơi các bạn có thể cùng nhau hát, chơi nhạc cụ và biểu diễn.</p>', chuNhiem: 'Trần Thị Bảo', hoatDong: true, anhDaiDien: 'https://placehold.co/80x80/52c41a/fff?text=AN' },
  { id: 'clb_3', tenCLB: 'CLB Thể thao', ngayThanhLap: '2018-08-20', moTa: '<p>Câu lạc bộ <strong>thể thao</strong> tổ chức các hoạt động rèn luyện thể chất cho sinh viên.</p>', chuNhiem: 'Lê Hoàng Cường', hoatDong: true, anhDaiDien: 'https://placehold.co/80x80/fa8c16/fff?text=TT' },
  { id: 'clb_4', tenCLB: 'CLB Tình nguyện', ngayThanhLap: '2021-01-10', moTa: '<p>Câu lạc bộ <strong>tình nguyện</strong> thực hiện các hoạt động từ thiện và hỗ trợ cộng đồng.</p>', chuNhiem: 'Phạm Minh Đức', hoatDong: false, anhDaiDien: 'https://placehold.co/80x80/eb2f96/fff?text=TN' },
  { id: 'clb_5', tenCLB: 'CLB Tiếng Anh', ngayThanhLap: '2022-02-14', moTa: '<p>Câu lạc bộ <strong>tiếng Anh</strong> giúp sinh viên nâng cao kỹ năng ngôn ngữ qua các hoạt động giao tiếp.</p>', chuNhiem: 'Hoàng Thị Evy', hoatDong: true, anhDaiDien: 'https://placehold.co/80x80/722ed1/fff?text=TA' },
];

export const MOCK_MEMBERSHIPS: DonDangKy[] = [
  { id: 'don_1', hoTen: 'Vũ Thanh Hà', email: 'hav@email.com', sdt: '0901234567', gioiTinh: 'Nữ', diaChi: 'Hà Nội', soTruong: 'Lập trình Python', clubId: 'clb_1', lyDo: 'Muốn nâng cao kỹ năng lập trình', trangThai: 'Pending', ghiChu: '', ngayDangKy: '2024-03-01' },
  { id: 'don_2', hoTen: 'Ngô Quang Khải', email: 'khai@email.com', sdt: '0912345678', gioiTinh: 'Nam', diaChi: 'Hải Phòng', soTruong: 'Guitar', clubId: 'clb_2', lyDo: 'Đam mê âm nhạc từ nhỏ', trangThai: 'Approved', ghiChu: 'Đã phỏng vấn', ngayDangKy: '2024-02-15' },
  { id: 'don_3', hoTen: 'Đinh Thị Lan', email: 'lan@email.com', sdt: '0923456789', gioiTinh: 'Nữ', diaChi: 'Đà Nẵng', soTruong: 'Bóng rổ', clubId: 'clb_3', lyDo: 'Rèn luyện sức khỏe', trangThai: 'Approved', ghiChu: '', ngayDangKy: '2024-01-20' },
  { id: 'don_4', hoTen: 'Bùi Văn Mạnh', email: 'manh@email.com', sdt: '0934567890', gioiTinh: 'Nam', diaChi: 'HCM', soTruong: 'Tổ chức sự kiện', clubId: 'clb_4', lyDo: 'Muốn đóng góp cho cộng đồng', trangThai: 'Rejected', ghiChu: '', lyDoTuChoi: 'Hồ sơ không đầy đủ', ngayDangKy: '2024-03-10' },
  { id: 'don_5', hoTen: 'Cao Thị Ngọc', email: 'ngoc@email.com', sdt: '0945678901', gioiTinh: 'Nữ', diaChi: 'Cần Thơ', soTruong: 'Tiếng Anh giao tiếp', clubId: 'clb_5', lyDo: 'Muốn luyện nói tiếng Anh', trangThai: 'Pending', ghiChu: '', ngayDangKy: '2024-03-20' },
  { id: 'don_6', hoTen: 'Trịnh Văn Phong', email: 'phong@email.com', sdt: '0956789012', gioiTinh: 'Nam', diaChi: 'Hà Nội', soTruong: 'JavaScript', clubId: 'clb_1', lyDo: 'Thích lập trình web', trangThai: 'Approved', ghiChu: 'Có kinh nghiệm', ngayDangKy: '2024-01-05' },
  { id: 'don_7', hoTen: 'Lý Thị Quỳnh', email: 'quynh@email.com', sdt: '0967890123', gioiTinh: 'Nữ', diaChi: 'Huế', soTruong: 'Hát', clubId: 'clb_2', lyDo: 'Muốn biểu diễn âm nhạc', trangThai: 'Pending', ghiChu: '', ngayDangKy: '2024-03-25' },
  { id: 'don_8', hoTen: 'Mai Văn Sơn', email: 'son@email.com', sdt: '0978901234', gioiTinh: 'Nam', diaChi: 'Nghệ An', soTruong: 'Bóng đá', clubId: 'clb_3', lyDo: 'Yêu thích thể thao', trangThai: 'Approved', ghiChu: '', ngayDangKy: '2024-02-01' },
  { id: 'don_9', hoTen: 'Phan Thị Thu', email: 'thu@email.com', sdt: '0989012345', gioiTinh: 'Nữ', diaChi: 'Bình Dương', soTruong: 'Từ thiện', clubId: 'clb_4', lyDo: 'Muốn giúp đỡ người khó khăn', trangThai: 'Pending', ghiChu: '', ngayDangKy: '2024-03-18' },
  { id: 'don_10', hoTen: 'Dương Văn Uy', email: 'uy@email.com', sdt: '0990123456', gioiTinh: 'Nam', diaChi: 'Đồng Nai', soTruong: 'IELTS', clubId: 'clb_5', lyDo: 'Cần môi trường luyện tập tiếng Anh', trangThai: 'Approved', ghiChu: '', ngayDangKy: '2024-02-20' },
  { id: 'don_11', hoTen: 'Hồ Thị Vân', email: 'van@email.com', sdt: '0901357924', gioiTinh: 'Nữ', diaChi: 'Hà Nội', soTruong: 'ReactJS', clubId: 'clb_1', lyDo: 'Muốn học lập trình frontend', trangThai: 'Rejected', ghiChu: '', lyDoTuChoi: 'Chưa đủ điều kiện đầu vào', ngayDangKy: '2024-03-05' },
  { id: 'don_12', hoTen: 'Kiều Văn Xuân', email: 'xuan@email.com', sdt: '0912468013', gioiTinh: 'Nam', diaChi: 'Hải Dương', soTruong: 'Piano', clubId: 'clb_2', lyDo: 'Muốn chia sẻ đam mê âm nhạc', trangThai: 'Approved', ghiChu: 'Đã qua vòng thử', ngayDangKy: '2024-01-28' },
];

export const loadClubs = (): CauLacBo[] => {
  try {
    const raw = localStorage.getItem(CLUBS_KEY);
    return raw ? JSON.parse(raw) : MOCK_CLUBS;
  } catch {
    return MOCK_CLUBS;
  }
};

export const saveClubs = (data: CauLacBo[]) => {
  localStorage.setItem(CLUBS_KEY, JSON.stringify(data));
};

export const loadMemberships = (): DonDangKy[] => {
  try {
    const raw = localStorage.getItem(MEMBERSHIPS_KEY);
    return raw ? JSON.parse(raw) : MOCK_MEMBERSHIPS;
  } catch {
    return MOCK_MEMBERSHIPS;
  }
};

export const saveMemberships = (data: DonDangKy[]) => {
  localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(data));
};

export const loadHistory = (): LichSuThaoTac[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (data: LichSuThaoTac[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
};
