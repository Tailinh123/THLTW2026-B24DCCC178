import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { Product, Order, OrderStatus, OrderProduct, ProductFormValues, DashboardStats } from '@/pages/BUOI_2/types';
import { STORAGE_KEYS, STATUS_TRANSITIONS } from '@/pages/BUOI_2/constants';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/pages/BUOI_2/mockData';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export default () => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const dashboardStats = useMemo<DashboardStats>(() => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const ordersByStatus = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );
    return { totalProducts, totalInventoryValue, totalOrders, totalRevenue, ordersByStatus };
  }, [products, orders]);

  const updateProduct = useCallback((id: number, values: ProductFormValues) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...values } : p)),
    );
    message.success('Cập nhật sản phẩm thành công!');
  }, []);

  const addOrder = useCallback(
    (customerName: string, orderProducts: OrderProduct[]) => {
      const totalAmount = orderProducts.reduce((sum, op) => sum + op.price * op.quantity, 0);
      const newOrder: Order = {
        id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
        customerName,
        products: orderProducts,
        totalAmount,
        status: 'Chờ xử lý',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setProducts((prev) =>
        prev.map((p) => {
          const ordered = orderProducts.find((op) => op.productId === p.id);
          if (ordered) {
            return { ...p, quantity: Math.max(0, p.quantity - ordered.quantity) };
          }
          return p;
        }),
      );

      setOrders((prev) => [...prev, newOrder]);
      message.success('Tạo đơn hàng thành công!');
    },
    [orders],
  );

  const updateOrderStatus = useCallback(
    (orderId: number, newStatus: OrderStatus) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const allowed = STATUS_TRANSITIONS[order.status];
      if (!allowed.includes(newStatus)) {
        message.error(`Không thể chuyển từ "${order.status}" sang "${newStatus}"`);
        return;
      }

      if (newStatus === 'Đã hủy' && order.status !== 'Hoàn thành') {
        setProducts((prev) =>
          prev.map((p) => {
            const ordered = order.products.find((op) => op.productId === p.id);
            if (ordered) {
              return { ...p, quantity: p.quantity + ordered.quantity };
            }
            return p;
          }),
        );
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    },
    [orders],
  );

  return {
    products,
    orders,
    dashboardStats,
    updateProduct,
    addOrder,
    updateOrderStatus,
  };
};
