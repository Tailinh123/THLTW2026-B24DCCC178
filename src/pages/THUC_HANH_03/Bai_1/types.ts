import type { Dayjs } from 'dayjs';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkShift {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  serviceIds: string[];
  maxClientsPerDay: number;
  schedule: WorkShift[];
  phone: string;
  bio: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  color: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  employeeId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: { content: string; createdAt: string };
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Cắt tóc nam', description: 'Cắt tạo kiểu nam hiện đại', price: 80000, durationMinutes: 30, category: 'Tóc', color: 'blue', isActive: true },
  { id: 's2', name: 'Nhuộm tóc', description: 'Nhuộm màu theo yêu cầu', price: 350000, durationMinutes: 90, category: 'Tóc', color: 'purple', isActive: true },
  { id: 's3', name: 'Massage thư giãn', description: 'Massage toàn thân 60 phút', price: 250000, durationMinutes: 60, category: 'Spa', color: 'green', isActive: true },
  { id: 's4', name: 'Làm móng tay', description: 'Sơn gel, vẽ nghệ thuật', price: 150000, durationMinutes: 45, category: 'Nail', color: 'red', isActive: true },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e1', name: 'Nguyễn Thị Lan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan',
    specialization: 'Chuyên gia tóc', serviceIds: ['s1', 's2'],
    maxClientsPerDay: 8, phone: '0901234567',
    bio: '5 năm kinh nghiệm tạo kiểu tóc.',
    schedule: [
      { day: 1, startTime: '08:00', endTime: '17:00' },
      { day: 2, startTime: '08:00', endTime: '17:00' },
      { day: 3, startTime: '08:00', endTime: '17:00' },
      { day: 4, startTime: '08:00', endTime: '17:00' },
      { day: 5, startTime: '08:00', endTime: '17:00' },
    ],
  },
  {
    id: 'e2', name: 'Trần Văn Minh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    specialization: 'Kỹ thuật viên tóc nam', serviceIds: ['s1'],
    maxClientsPerDay: 10, phone: '0912345678',
    bio: 'Chuyên cắt tóc nam, undercut, fade.',
    schedule: [
      { day: 1, startTime: '09:00', endTime: '18:00' },
      { day: 3, startTime: '09:00', endTime: '18:00' },
      { day: 5, startTime: '09:00', endTime: '18:00' },
      { day: 6, startTime: '09:00', endTime: '18:00' },
    ],
  },
  {
    id: 'e3', name: 'Lê Thị Hoa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa',
    specialization: 'Chuyên gia spa', serviceIds: ['s3'],
    maxClientsPerDay: 6, phone: '0923456789',
    bio: 'Chuyên viên spa chứng chỉ quốc tế.',
    schedule: [
      { day: 1, startTime: '08:00', endTime: '16:00' },
      { day: 2, startTime: '08:00', endTime: '16:00' },
      { day: 4, startTime: '08:00', endTime: '16:00' },
      { day: 5, startTime: '08:00', endTime: '16:00' },
    ],
  },
  {
    id: 'e4', name: 'Phạm Thị Thu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thu',
    specialization: 'Kỹ thuật viên nail', serviceIds: ['s4'],
    maxClientsPerDay: 8, phone: '0934567890',
    bio: 'Chuyên nail art, gel và acrylic.',
    schedule: [
      { day: 2, startTime: '09:00', endTime: '18:00' },
      { day: 3, startTime: '09:00', endTime: '18:00' },
      { day: 4, startTime: '09:00', endTime: '18:00' },
      { day: 6, startTime: '09:00', endTime: '17:00' },
    ],
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', customerName: 'Nguyễn Văn An', customerPhone: '0987654321', serviceId: 's1', employeeId: 'e2', date: '2025-01-20', startTime: '09:00', endTime: '09:30', status: 'completed', notes: 'Thích undercut', createdAt: '2025-01-18T10:00:00Z' },
  { id: 'a2', customerName: 'Trần Thị Bình', customerPhone: '0976543210', serviceId: 's3', employeeId: 'e3', date: '2025-01-20', startTime: '10:00', endTime: '11:00', status: 'completed', notes: '', createdAt: '2025-01-19T08:00:00Z' },
  { id: 'a3', customerName: 'Lê Minh Châu', customerPhone: '0965432109', serviceId: 's2', employeeId: 'e1', date: '2025-01-25', startTime: '14:00', endTime: '15:30', status: 'confirmed', notes: 'Nhuộm nâu caramel', createdAt: '2025-01-20T09:00:00Z' },
  { id: 'a4', customerName: 'Phạm Quốc Dũng', customerPhone: '0954321098', serviceId: 's3', employeeId: 'e3', date: '2025-01-26', startTime: '09:00', endTime: '10:00', status: 'pending', notes: '', createdAt: '2025-01-20T14:00:00Z' },
  { id: 'a5', customerName: 'Hoàng Thị Em', customerPhone: '0943210987', serviceId: 's4', employeeId: 'e4', date: '2025-01-27', startTime: '10:00', endTime: '10:45', status: 'pending', notes: 'Vẽ hoa', createdAt: '2025-01-21T10:00:00Z' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', appointmentId: 'a1', employeeId: 'e2', customerName: 'Nguyễn Văn An', rating: 5, comment: 'Cắt rất đẹp, đúng ý!', createdAt: '2025-01-20T15:00:00Z', reply: { content: 'Cảm ơn bạn! Hẹn gặp lại!', createdAt: '2025-01-20T16:00:00Z' } },
  { id: 'r2', appointmentId: 'a2', employeeId: 'e3', customerName: 'Trần Thị Bình', rating: 4, comment: 'Massage rất thư giãn, sẽ quay lại!', createdAt: '2025-01-20T18:00:00Z' },
];

// ── Utils ──────────────────────────────────────────────────────────────────────

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Chủ nhật', 1: 'Thứ 2', 2: 'Thứ 3',
  3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7',
};

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const formatDate = (d: string) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

export const calcEndTime = (start: string, mins: number): string => {
  const [h, m] = start.split(':').map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
};

export const generateTimeSlots = (start: string, end: string, dur: number): string[] => {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em - dur;
  while (cur <= endMin) {
    slots.push(`${String(Math.floor(cur/60)).padStart(2,'0')}:${String(cur%60).padStart(2,'0')}`);
    cur += 30;
  }
  return slots;
};

export const hasConflict = (
  appointments: Appointment[], employeeId: string,
  date: string, startTime: string, dur: number, excludeId?: string
): boolean => {
  const [sh, sm] = startTime.split(':').map(Number);
  const ns = sh * 60 + sm, ne = ns + dur;
  return appointments
    .filter(a => a.employeeId === employeeId && a.date === date && a.status !== 'cancelled' && a.id !== excludeId)
    .some(a => {
      const [ash, asm] = a.startTime.split(':').map(Number);
      const [aeh, aem] = a.endTime.split(':').map(Number);
      return ns < aeh * 60 + aem && ne > ash * 60 + asm;
    });
};