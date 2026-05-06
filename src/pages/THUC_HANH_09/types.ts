export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  deadline: string;
}

export type ColumnId = Status;

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export const STORAGE_KEY = 'THUC_HANH_09_TASKS';

export const genId = (): string =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const MOCK_TASKS: Task[] = [
  {
    id: genId(),
    title: 'Thiết kế giao diện Dashboard',
    description: 'Xây dựng layout Dashboard với các thống kê tổng quan, biểu đồ tiến độ và card tóm tắt trạng thái dự án.',
    status: 'DONE',
    priority: 'HIGH',
    tags: ['UI/UX', 'Frontend'],
    deadline: '2026-05-10T23:59:59',
  },
  {
    id: genId(),
    title: 'Tích hợp API Authentication',
    description: 'Kết nối hệ thống đăng nhập với OAuth 2.0, hỗ trợ Google & GitHub sign-in cho người dùng.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: ['Backend', 'Security'],
    deadline: '2026-05-08T23:59:59',
  },
  {
    id: genId(),
    title: 'Viết Unit Test cho module Task',
    description: 'Bao phủ 80% code coverage cho các hàm CRUD task, bao gồm edge case và validation.',
    status: 'TODO',
    priority: 'MEDIUM',
    tags: ['Testing', 'Quality'],
    deadline: '2026-05-15T23:59:59',
  },
  {
    id: genId(),
    title: 'Tối ưu hiệu suất trang Kanban',
    description: 'Cải thiện performance kéo thả, giảm re-render không cần thiết bằng React.memo và useMemo.',
    status: 'TODO',
    priority: 'LOW',
    tags: ['Performance', 'Frontend'],
    deadline: '2026-05-20T23:59:59',
  },
  {
    id: genId(),
    title: 'Deploy staging environment',
    description: 'Thiết lập CI/CD pipeline với GitHub Actions, deploy lên Vercel staging cho team QA review.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    tags: ['DevOps', 'CI/CD'],
    deadline: '2026-05-04T23:59:59',
  },
  {
    id: genId(),
    title: 'Responsive Mobile Layout',
    description: 'Tối ưu giao diện cho thiết bị di động, đảm bảo trải nghiệm mượt mà trên màn hình nhỏ.',
    status: 'TODO',
    priority: 'HIGH',
    tags: ['UI/UX', 'Mobile'],
    deadline: '2026-05-12T23:59:59',
  },
];

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Task[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
  return MOCK_TASKS;
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const PRIORITY_CONFIG: Record<Priority, { color: string; label: string; weight: number }> = {
  HIGH: { color: '#ef4444', label: 'Cao', weight: 3 },
  MEDIUM: { color: '#f59e0b', label: 'Trung bình', weight: 2 },
  LOW: { color: '#10b981', label: 'Thấp', weight: 1 },
};

export const STATUS_CONFIG: Record<Status, { color: string; label: string; icon: string }> = {
  TODO: { color: '#6366f1', label: 'Cần làm', icon: '📋' },
  IN_PROGRESS: { color: '#3b82f6', label: 'Đang làm', icon: '🔄' },
  DONE: { color: '#10b981', label: 'Hoàn thành', icon: '✅' },
};

export const isOverdue = (deadline: string, status: Status): boolean => {
  if (status === 'DONE') return false;
  return new Date(deadline) < new Date();
};
