// ========================
// Utility — Formatters
// ========================

import moment from 'moment';

/**
 * Format date string (YYYY-MM-DD) → DD/MM/YYYY
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return moment(dateStr).format('DD/MM/YYYY');
};

/**
 * Format number với dấu phân cách hàng nghìn
 */
export const formatNumber = (n: number): string => {
  return n.toLocaleString('vi-VN');
};

/**
 * Trả về chuỗi "x ngày trước", "Hôm nay", "Hôm qua"
 */
export const timeAgo = (dateStr: string): string => {
  const now = moment().startOf('day');
  const target = moment(dateStr).startOf('day');
  const diffDays = now.diff(target, 'days');

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return `${Math.floor(diffDays / 30)} tháng trước`;
};

/**
 * Format duration (phút) → chuỗi đọc được
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
