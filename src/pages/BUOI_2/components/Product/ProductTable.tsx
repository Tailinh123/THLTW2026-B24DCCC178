import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Input, Select, Row, Col } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Product, ProductStatus } from '../../types';
import { PRODUCT_CATEGORIES } from '../../constants';

interface ProductTableProps {
  dataSource: Product[];
  onEdit: (product: Product) => void;
}

const getProductStatus = (quantity: number): ProductStatus => {
  if (quantity > 10) return 'Còn hàng';
  if (quantity >= 1) return 'Sắp hết';
  return 'Hết hàng';
};

const statusTagColor: Record<ProductStatus, string> = {
  'Còn hàng': 'green',
  'Sắp hết': 'orange',
  'Hết hàng': 'red',
};

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const ProductTable: React.FC<ProductTableProps> = ({ dataSource, onEdit }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  const filteredData = useMemo(() => {
    let result = dataSource;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(kw));
    }
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    return result;
  }, [dataSource, searchKeyword, categoryFilter]);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Tag className="stt-tag">{index + 1}</Tag>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => (
        <span style={{ color: '#10b981', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {formatVND(price)}
        </span>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
      render: (qty: number) => (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Product) => {
        const status = getProductStatus(record.quantity);
        return <Tag color={statusTagColor[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: Product) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <Row gutter={12}>
          <Col xs={24} sm={16}>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
              size="large"
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Lọc danh mục"
              allowClear
              size="large"
              style={{ width: '100%', borderRadius: 8 }}
              onChange={(val) => setCategoryFilter(val)}
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        className="product-table"
      />
    </div>
  );
};

export default ProductTable;
