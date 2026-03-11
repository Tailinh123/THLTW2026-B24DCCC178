import React from 'react';
import { Table, Button, Popconfirm, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Product } from '../types';

interface ProductTableProps {
  dataSource: Product[];
  onDelete: (id: number, name: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const ProductTable: React.FC<ProductTableProps> = ({ dataSource, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: Product, index: number) => (
        <Tag className="stt-tag">{index + 1}</Tag>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string) => <span className="product-name">{name}</span>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 180,
      align: 'right' as const,
      render: (price: number) => (
        <span className="price-cell">{formatCurrency(price)}</span>
      ),
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center' as const,
      render: (quantity: number) => (
        <span className="quantity-cell">{quantity}</span>
      ),
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: Product) => (
        <Popconfirm
          title={`Bạn có chắc muốn xóa "${record.name}"?`}
          onConfirm={() => onDelete(record.id, record.name)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            icon={<DeleteOutlined />}
            size="small"
            className="delete-btn"
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={{
        pageSize: 5,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} sản phẩm`,
      }}
      className="product-table"
    />
  );
};

export default ProductTable;
