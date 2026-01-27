import { OrderStatus } from './types';

export const PRODUCT_CATEGORIES = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Phụ kiện'];

export const ORDER_STATUSES: OrderStatus[] = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  'Chờ xử lý': 'gold',
  'Đang giao': 'blue',
  'Hoàn thành': 'green',
  'Đã hủy': 'red',
};

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'Chờ xử lý': ['Đang giao', 'Đã hủy'],
  'Đang giao': ['Hoàn thành', 'Đã hủy'],
  'Hoàn thành': [],
  'Đã hủy': [],
};

export const STORAGE_KEYS = {
  PRODUCTS: 'buoi2_products',
  ORDERS: 'buoi2_orders',
};
