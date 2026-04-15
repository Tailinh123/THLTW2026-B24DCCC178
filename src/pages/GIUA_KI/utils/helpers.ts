import { RoomType, ROOM_TYPE_LABELS } from '../types/room';
import { CAPACITY_MIN, CAPACITY_MAX } from '../constants';

export function getCapacityColor(capacity: number): string {
  if (capacity <= 50) return '#10B981';
  if (capacity <= 100) return '#F59E0B';
  if (capacity <= 150) return '#F97316';
  return '#EF4444';
}

export function getCapacityPercent(capacity: number): number {
  const clamped = Math.max(CAPACITY_MIN, Math.min(CAPACITY_MAX, capacity));
  return Math.round(((clamped - CAPACITY_MIN) / (CAPACITY_MAX - CAPACITY_MIN)) * 100);
}

export function formatRoomType(type: RoomType): string {
  return ROOM_TYPE_LABELS[type] || type;
}

export function canDeleteRoom(capacity: number): boolean {
  return capacity < 30;
}

export function generateSimpleId(): string {
  return `RM-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export function normalizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function getCapacityLabel(capacity: number): string {
  if (capacity <= 30) return 'Nhỏ';
  if (capacity <= 80) return 'Trung bình';
  if (capacity <= 150) return 'Lớn';
  return 'Rất lớn';
}
