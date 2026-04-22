import { Product, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24 Ultra', category: 'Điện thoại', price: 28000000, quantity: 12 },
  { id: 4, name: 'MacBook Air M3', category: 'Laptop', price: 32000000, quantity: 5 },
  { id: 5, name: 'iPad Pro M4', category: 'Máy tính bảng', price: 22000000, quantity: 0 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 25 },
  { id: 7, name: 'Laptop HP Spectre x360', category: 'Laptop', price: 27000000, quantity: 3 },
  { id: 8, name: 'Xiaomi 14 Ultra', category: 'Điện thoại', price: 18000000, quantity: 20 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 },
      { productId: 6, productName: 'AirPods Pro 2', quantity: 2, price: 6000000 },
    ],
    totalAmount: 37000000,
    status: 'Hoàn thành',
    createdAt: '2026-04-28',
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    products: [
      { productId: 2, productName: 'iPhone 15 Pro Max', quantity: 1, price: 30000000 },
    ],
    totalAmount: 30000000,
    status: 'Đang giao',
    createdAt: '2026-04-30',
  },
  {
    id: 3,
    customerName: 'Lê Văn C',
    products: [
      { productId: 4, productName: 'MacBook Air M3', quantity: 1, price: 32000000 },
      { productId: 6, productName: 'AirPods Pro 2', quantity: 1, price: 6000000 },
    ],
    totalAmount: 38000000,
    status: 'Chờ xử lý',
    createdAt: '2026-05-01',
  },
];
