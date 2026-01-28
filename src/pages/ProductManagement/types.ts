export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export type ProductStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng';

export interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string; // ISO date or yyyy-mm-dd
}
