import React, { useState } from 'react';
import { Card, Typography, Tabs, Button } from 'antd';
import { PlusOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import StatCards from './components/Dashboard/StatCards';
import ProductTable from './components/Product/ProductTable';
import ProductFormModal from './components/Product/ProductFormModal';
import OrderTable from './components/Order/OrderTable';
import OrderFormModal from './components/Order/OrderFormModal';
import OrderDetailModal from './components/Order/OrderDetailModal';
import { Product, Order } from './types';
import './index.less';

const { Title } = Typography;
const { TabPane } = Tabs;

const Buoi2Page: React.FC = () => {
  const {
    products,
    orders,
    dashboardStats,
    updateProduct,
    addOrder,
    updateOrderStatus,
  } = useModel('buoi2');

  const [activeTab, setActiveTab] = useState('products');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsProductModalVisible(true);
  };

  const handleProductFormSubmit = (id: number, values: any) => {
    updateProduct(id, values);
    setIsProductModalVisible(false);
    setEditProduct(null);
  };

  return (
    <div className="buoi2-page">
      <div className="page-header">
        <Title level={3} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>
          Quản lý Đơn hàng & Sản phẩm
        </Title>
      </div>

      <StatCards stats={dashboardStats} />

      <Card style={{ marginTop: 20, borderRadius: 12 }} bodyStyle={{ padding: '16px 20px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'products' ? null : (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsOrderModalVisible(true)}
                style={{ borderRadius: 8 }}
              >
                Tạo đơn hàng
              </Button>
            )
          }
        >
          <TabPane
            tab={
              <span>
                <AppstoreOutlined /> Sản phẩm
              </span>
            }
            key="products"
          >
            <ProductTable dataSource={products} onEdit={handleEditProduct} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <ShoppingCartOutlined /> Đơn hàng
              </span>
            }
            key="orders"
          >
            <OrderTable
              dataSource={orders}
              onViewDetail={(order) => setViewOrder(order)}
              onUpdateStatus={updateOrderStatus}
            />
          </TabPane>
        </Tabs>
      </Card>

      <ProductFormModal
        visible={isProductModalVisible}
        product={editProduct}
        onCancel={() => {
          setIsProductModalVisible(false);
          setEditProduct(null);
        }}
        onSubmit={handleProductFormSubmit}
      />

      <OrderFormModal
        visible={isOrderModalVisible}
        products={products}
        onCancel={() => setIsOrderModalVisible(false)}
        onSubmit={addOrder}
      />

      <OrderDetailModal
        visible={!!viewOrder}
        order={viewOrder}
        onCancel={() => setViewOrder(null)}
      />
    </div>
  );
};

export default Buoi2Page;
