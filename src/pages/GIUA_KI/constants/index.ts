import { Room, RoomType } from '../types/room';

export const LECTURERS: string[] = [
  'TS. Nguyễn Văn An',
  'PGS.TS. Trần Thị Bích',
  'ThS. Lê Hoàng Minh',
  'TS. Phạm Quốc Hùng',
  'PGS.TS. Võ Thị Lan',
  'ThS. Đặng Minh Tuấn',
  'GS.TS. Hoàng Văn Đức',
  'TS. Ngô Thanh Hà',
  'ThS. Bùi Thị Mai',
  'PGS.TS. Lý Quang Vinh',
];

export const DEFAULT_ROOMS: Room[] = [
  {
    id: 'A1-101',
    name: 'Phòng Lý thuyết CNTT 1',
    capacity: 120,
    type: RoomType.THEORY,
    manager: 'TS. Nguyễn Văn An',
  },
  {
    id: 'A1-202',
    name: 'Phòng Lý thuyết Toán cao cấp',
    capacity: 80,
    type: RoomType.THEORY,
    manager: 'PGS.TS. Trần Thị Bích',
  },
  {
    id: 'A2-305',
    name: 'Phòng Lý thuyết Vật lý',
    capacity: 60,
    type: RoomType.THEORY,
    manager: 'GS.TS. Hoàng Văn Đức',
  },
  {
    id: 'LAB-01',
    name: 'Phòng TH Mạng máy tính',
    capacity: 40,
    type: RoomType.PRACTICE,
    manager: 'ThS. Lê Hoàng Minh',
  },
  {
    id: 'LAB-02',
    name: 'Phòng TH Lập trình Web',
    capacity: 35,
    type: RoomType.PRACTICE,
    manager: 'TS. Phạm Quốc Hùng',
  },
  {
    id: 'LAB-03',
    name: 'Phòng TH Cơ sở dữ liệu',
    capacity: 25,
    type: RoomType.PRACTICE,
    manager: 'ThS. Đặng Minh Tuấn',
  },
  {
    id: 'LAB-04',
    name: 'Phòng TH Điện tử số',
    capacity: 20,
    type: RoomType.PRACTICE,
    manager: 'PGS.TS. Võ Thị Lan',
  },
  {
    id: 'HT-01',
    name: 'Hội trường A - Khu chính',
    capacity: 180,
    type: RoomType.HALL,
    manager: 'TS. Ngô Thanh Hà',
  },
  {
    id: 'HT-02',
    name: 'Hội trường B - Khu phụ',
    capacity: 150,
    type: RoomType.HALL,
    manager: 'ThS. Bùi Thị Mai',
  },
  {
    id: 'A3-108',
    name: 'Phòng Seminar Khoa CNTT',
    capacity: 15,
    type: RoomType.THEORY,
    manager: 'PGS.TS. Lý Quang Vinh',
  },
];

export const THEME_TOKENS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryBg: '#EEF2FF',
  primaryDark: '#3730A3',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  chartTheory: '#6366F1',
  chartPractice: '#10B981',
  chartHall: '#F59E0B',
  lightBg: '#F8FAFC',
  lightSurface: '#FFFFFF',
  lightBorder: '#E2E8F0',
  lightText: '#0F172A',
  lightTextSecondary: '#64748B',
  darkBg: '#0F172A',
  darkSurface: '#1E293B',
  darkBorder: '#334155',
  darkText: '#F1F5F9',
  darkTextSecondary: '#94A3B8',
} as const;

export const CAPACITY_MIN = 10;
export const CAPACITY_MAX = 200;
export const CAPACITY_DELETE_THRESHOLD = 30;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20];

export const ALL_COLUMN_KEYS = ['id', 'name', 'type', 'capacity', 'manager', 'actions'] as const;
export type ColumnKey = typeof ALL_COLUMN_KEYS[number];

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  id: 'Mã phòng',
  name: 'Tên phòng',
  type: 'Loại phòng',
  capacity: 'Sức chứa',
  manager: 'Người quản lý',
  actions: 'Thao tác',
};

export const SIDEBAR_MENU_ITEMS = [
  { key: 'rooms', label: 'Quản lý phòng', icon: 'DoorOpen', disabled: false },
  { key: 'schedule', label: 'Lịch sử dụng', icon: 'CalendarDays', disabled: true },
  { key: 'reports', label: 'Báo cáo', icon: 'BarChart3', disabled: true },
  { key: 'settings', label: 'Cài đặt', icon: 'Settings', disabled: true },
] as const;

export const PERSIST_KEY = 'giua-ki-room-mgmt';
