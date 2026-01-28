import { Table, Button, Popconfirm, Tag } from 'antd';
import { Product } from './types';

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (p: Product) => void;
}

const getProductStatus = (quantity: number) => {
  if (quantity === 0) {
    return { text: 'Hết hàng', color: 'red' };
  } else if (quantity <= 10) {
    return { text: 'Sắp hết', color: 'orange' };
  } else {
    return { text: 'Còn hàng', color: 'green' };
  }
};

const ProductTable = ({ products, onDelete, onEdit }: Props) => {
  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 120,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (value: number) => value.toLocaleString() + ' VND',
      sorter: (a: Product, b: Product) => a.price - b.price,
      width: 140,
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
      width: 130,
    },
    {
      title: 'Trạng thái',
      render: (_: any, record: Product) => {
        const status = getProductStatus(record.quantity);
        return <Tag color={status.color}>{status.text}</Tag>;
      },
      width: 110,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
      width: 120,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={products}
      pagination={{ pageSize: 5, pageSizeOptions: ['5', '10', '20'] }}
      scroll={{ x: 1200 }}
    />
  );
};

export default ProductTable;
