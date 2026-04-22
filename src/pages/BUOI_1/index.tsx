import React from 'react';
import { Button, Card, Typography, Row, Col } from 'antd';
import { PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import SearchFilter from './components/SearchFilter';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import './index.less';

const { Title } = Typography;

const ProductManagement: React.FC = () => {
  const {
    filteredProducts,
    isModalVisible,
    setIsModalVisible,
    setSearchKeyword,
    addProduct,
    deleteProduct,
  } = useModel('buoi1');

  return (
    <div className="product-management-page">
      <Card className="product-management-card">
        <Row justify="space-between" align="middle" className="page-header">
          <Col>
            <Title level={3} className="page-title">
              <ShoppingOutlined className="page-title-icon" />
              Quản lý Sản phẩm
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="add-product-btn"
              onClick={() => setIsModalVisible(true)}
            >
              Thêm sản phẩm
            </Button>
          </Col>
        </Row>

        <div className="search-wrapper">
          <SearchFilter onSearch={setSearchKeyword} />
        </div>

        <ProductTable
          dataSource={filteredProducts}
          onDelete={deleteProduct}
        />
      </Card>

      <ProductFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={addProduct}
      />
    </div>
  );
};

export default ProductManagement;
