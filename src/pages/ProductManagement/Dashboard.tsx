import { Card, Row, Col, Statistic, Progress, Divider } from 'antd';
import { Product, Order } from './types';

interface Props {
  products: Product[];
  orders: Order[];
}

const calculateStats = (products: Product[], orders: Order[]) => {
  const totalProducts = products.length;
  
  const totalStockValue = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
  
  const totalOrders = orders.length;
  
  const revenue = orders
    .filter((order) => order.status === 'Hoàn thành')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const ordersByStatus: Record<string, number> = {};
  orders.forEach((order) => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
  });

  return { totalProducts, totalStockValue, totalOrders, revenue, ordersByStatus };
};

const Dashboard = ({ products, orders }: Props) => {
  const stats = calculateStats(products, orders);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="Tổng số sản phẩm" value={stats.totalProducts} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng giá trị tồn kho"
              value={stats.totalStockValue}
              precision={0}
              suffix=" VND"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title="Tổng số đơn hàng" value={stats.totalOrders} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Doanh thu (Hoàn thành)"
              value={stats.revenue}
              precision={0}
              suffix=" VND"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h3>Số đơn hàng theo trạng thái</h3>
        <Divider />

        {Object.entries(stats.ordersByStatus).map(([status, count]) => {
          const percent =
            stats.totalOrders > 0
              ? Math.round((count / stats.totalOrders) * 100)
              : 0;

          return (
            <div key={status} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <strong>{status}</strong>
                <span>
                  {count} ({percent}%)
                </span>
              </div>
              <Progress percent={percent} />
            </div>
          );
        })}

        {stats.totalOrders === 0 && (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Chưa có đơn hàng nào
          </p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
