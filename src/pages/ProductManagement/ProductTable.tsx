import { Table, Button, Popconfirm } from 'antd';
import { Product } from './types';

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

const ProductTable = ({ products, onDelete }: Props) => {
  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
        <Popconfirm
          title="Bạn có chắc chắn xóa?"
          onConfirm={() => onDelete(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={products} />;
};

export default ProductTable;
