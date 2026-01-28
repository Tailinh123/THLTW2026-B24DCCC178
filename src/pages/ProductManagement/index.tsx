import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, message, Space, Select, Row, Col, Tabs, DatePicker } from 'antd';
import { initialProducts, initialOrders } from './data';
import { Product, Order } from './types';
import ProductTable from './ProductTable';
import ProductFormModal from './ProductFormModal';
import OrderTable from './OrderTable';
import OrderFormModal from './OrderFormModal';
import OrderDetailModal from './OrderDetailModal';
import Dashboard from './Dashboard';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PRODUCTS_LS = 'pm_products_v1';
const ORDERS_LS = 'pm_orders_v1';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(PRODUCTS_LS);
      return raw ? JSON.parse(raw) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(ORDERS_LS);
      return raw ? JSON.parse(raw) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [orderSearchText, setOrderSearchText] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string | null>(null);
  const [orderDateRange, setOrderDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_LS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDERS_LS, JSON.stringify(orders));
  }, [orders]);

  const handleSaveProduct = useCallback((product: any) => {
    if (product.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      message.success('Cập nhật sản phẩm thành công');
    } else {
      const newProd: Product = { ...product, id: Date.now() };
      setProducts((prev) => [newProd, ...prev]);
      message.success('Thêm sản phẩm thành công');
    }
    setProdModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleDeleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      if (categoryFilter && p.category !== categoryFilter) {
        return false;
      }
      if (minPrice != null && p.price < minPrice) {
        return false;
      }
      if (maxPrice != null && p.price > maxPrice) {
        return false;
      }
      if (statusFilter) {
        const status =
          p.quantity === 0 ? 'Hết hàng' : p.quantity <= 10 ? 'Sắp hết' : 'Còn hàng';
        if (status !== statusFilter) {
          return false;
        }
      }
      return true;
    });
  }, [products, searchText, categoryFilter, minPrice, maxPrice, statusFilter]);

  const handleCreateOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setOrderModalOpen(false);
  }, []);

  const changeOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o));
      const oldOrder = prev.find((o) => o.id === id);
      const updatedOrder = next.find((o) => o.id === id)!;

      if (!oldOrder) return next;

      if (oldOrder.status !== 'Hoàn thành' && status === 'Hoàn thành') {
        setProducts((ps) =>
          ps.map((product) => {
            const orderProduct = updatedOrder.products.find(
              (op) => op.productId === product.id
            );
            if (!orderProduct) return product;
            return {
              ...product,
              quantity: Math.max(0, product.quantity - orderProduct.quantity),
            };
          })
        );
      }

      if (oldOrder.status !== 'Đã hủy' && status === 'Đã hủy') {
        setProducts((ps) =>
          ps.map((product) => {
            const orderProduct = updatedOrder.products.find(
              (op) => op.productId === product.id
            );
            if (!orderProduct) return product;
            return {
              ...product,
              quantity: product.quantity + orderProduct.quantity,
            };
          })
        );
      }

      return next;
    });
    message.success('Cập nhật trạng thái đơn hàng');
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (
        orderSearchText &&
        !order.customerName
          .toLowerCase()
          .includes(orderSearchText.toLowerCase()) &&
        !order.id.toLowerCase().includes(orderSearchText.toLowerCase())
      ) {
        return false;
      }
      if (orderStatusFilter && order.status !== orderStatusFilter) {
        return false;
      }
      if (orderDateRange) {
        const [startDate, endDate] = orderDateRange;
        const orderDate = order.createdAt;
        if (orderDate < startDate || orderDate > endDate) {
          return false;
        }
      }
      return true;
    });
  }, [orders, orderSearchText, orderStatusFilter, orderDateRange]);

  const handleViewOrder = (order: Order) => {
    setDetailOrder(order);
  };

  return (
    <div>
      <h2>Quản lý đơn hàng & sản phẩm</h2>

      <Tabs defaultActiveKey="dashboard">
        <Tabs.TabPane tab="Tổng quan" key="dashboard">
          <Dashboard products={products} orders={orders} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý Sản phẩm" key="products">
          <Row style={{ marginBottom: 12 }} gutter={12} align="middle">
            <Col>
              <Input.Search
                placeholder="Tìm kiếm theo tên"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 220 }}
              />
            </Col>

            <Col>
              <Select
                placeholder="Danh mục"
                allowClear
                style={{ width: 160 }}
                onChange={(v) => setCategoryFilter(v || null)}
              >
                {[...new Set(products.map((p) => p.category))].map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col>
              <Input
                placeholder="Min giá"
                type="number"
                onChange={(e) =>
                  setMinPrice(e.target.value ? Number(e.target.value) : null)
                }
                style={{ width: 120 }}
              />
            </Col>

            <Col>
              <Input
                placeholder="Max giá"
                type="number"
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : null)
                }
                style={{ width: 120 }}
              />
            </Col>

            <Col>
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: 140 }}
                onChange={(v) => setStatusFilter(v || null)}
              >
                <Option value="Còn hàng">Còn hàng</Option>
                <Option value="Sắp hết">Sắp hết</Option>
                <Option value="Hết hàng">Hết hàng</Option>
              </Select>
            </Col>

            <Col flex="auto" />

            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setProdModalOpen(true);
                  setEditingProduct(null);
                }}
              >
                Thêm sản phẩm
              </Button>
            </Col>
          </Row>

          <ProductTable
            products={filteredProducts}
            onDelete={handleDeleteProduct}
            onEdit={(p) => {
              setEditingProduct(p);
              setProdModalOpen(true);
            }}
          />

          <ProductFormModal
            open={prodModalOpen}
            onCancel={() => setProdModalOpen(false)}
            onSave={handleSaveProduct}
            initialValues={editingProduct || undefined}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý Đơn hàng" key="orders">
          <Row style={{ marginBottom: 12 }} gutter={12} align="middle">
            <Col>
              <Input.Search
                placeholder="Tìm kiếm theo tên khách hoặc mã đơn"
                allowClear
                onChange={(e) => setOrderSearchText(e.target.value)}
                style={{ width: 280 }}
              />
            </Col>

            <Col>
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: 150 }}
                onChange={(v) => setOrderStatusFilter(v || null)}
              >
                <Option value="Chờ xử lý">Chờ xử lý</Option>
                <Option value="Đang giao">Đang giao</Option>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
            </Col>

            <Col>
              <RangePicker
                format="YYYY-MM-DD"
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setOrderDateRange([
                      dates[0].format('YYYY-MM-DD'),
                      dates[1].format('YYYY-MM-DD'),
                    ]);
                  } else {
                    setOrderDateRange(null);
                  }
                }}
              />
            </Col>

            <Col flex="auto" />

            <Col>
              <Button
                type="primary"
                onClick={() => setOrderModalOpen(true)}
              >
                Tạo đơn hàng
              </Button>
            </Col>
          </Row>

          <OrderTable
            orders={filteredOrders}
            onChangeStatus={changeOrderStatus}
            onView={handleViewOrder}
          />

          <OrderFormModal
            open={orderModalOpen}
            onCancel={() => setOrderModalOpen(false)}
            onCreate={handleCreateOrder}
            products={products}
          />

          <OrderDetailModal
            open={!!detailOrder}
            onCancel={() => setDetailOrder(null)}
            order={detailOrder}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ProductManagement;
