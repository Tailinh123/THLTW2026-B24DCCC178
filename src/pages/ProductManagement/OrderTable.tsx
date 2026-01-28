import { Table, Button, Select, Tag } from 'antd';
import { Order } from './types';

interface Props {
  orders: Order[];
  onChangeStatus: (id: string, status: Order['status']) => void;
  onView: (order: Order) => void;
}

const { Option } = Select;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Chờ xử lý':
      return 'orange';
    case 'Đang giao':
      return 'blue';
    case 'Hoàn thành':
      return 'green';
    case 'Đã hủy':
      return 'red';
    default:
      return 'default';
  }
};

const OrderTable = ({ orders, onChangeStatus, onView }: Props) => {
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      width: 100,
      sorter: (a: Order, b: Order) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      sorter: (a: Order, b: Order) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Số sản phẩm',
      render: (_: any, record: Order) => record.products.length,
      width: 100,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: (value: number) => value.toLocaleString() + ' VND',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      width: 140,
    },
    {
      title: 'Trạng thái',
      render: (_: any, record: Order) => (
        <Select
          value={record.status}
          onChange={(val) => onChangeStatus(record.id, val)}
          style={{ width: 150 }}
        >
          <Option value="Chờ xử lý">Chờ xử lý</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
      ),
      width: 160,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a: Order, b: Order) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      },
      width: 120,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => onView(record)}>
          Xem chi tiết
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 1000 }}
    />
  );
};

export default OrderTable;
