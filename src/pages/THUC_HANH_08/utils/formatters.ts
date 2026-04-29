



import moment from 'moment';


export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return moment(dateStr).format('DD/MM/YYYY');
};


export const formatNumber = (n: number): string => {
  return n.toLocaleString('vi-VN');
};


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


export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
