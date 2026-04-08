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

export type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface Order {
  id: number;
  customerName: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface OrderFormValues {
  customerName: string;
  products: OrderProduct[];
}

export interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<OrderStatus, number>;
}
