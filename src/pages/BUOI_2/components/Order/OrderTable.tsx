import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Input, Select, DatePicker, Row, Col } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Order, OrderStatus } from '../../types';
import { ORDER_STATUSES, ORDER_STATUS_COLORS, STATUS_TRANSITIONS } from '../../constants';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface OrderTableProps {
  dataSource: Order[];
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const OrderTable: React.FC<OrderTableProps> = ({
  dataSource,
  onViewDetail,
  onUpdateStatus,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const filteredData = useMemo(() => {
    let result = dataSource;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter((o) => o.customerName.toLowerCase().includes(kw));
    }
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (dateRange) {
      result = result.filter((o) => {
        const d = moment(o.createdAt);
        return d.isSameOrAfter(dateRange[0], 'day') && d.isSameOrBefore(dateRange[1], 'day');
      });
    }
    return result;
  }, [dataSource, searchKeyword, statusFilter, dateRange]);

  const columns = [
    {
      title: 'Mã ĐH',
      key: 'id',
      width: 90,
      render: (_: any, record: Order) => (
        <Tag color="geekblue" style={{ fontWeight: 600 }}>
          #{String(record.id).padStart(3, '0')}
        </Tag>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Số SP',
      key: 'productCount',
      width: 80,
      render: (_: any, record: Order) => record.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (val: number) => (
        <span style={{ color: '#10b981', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {formatVND(val)}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span style={{ color: '#64748b' }}>{moment(date).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Order) => {
        const allowedTransitions = STATUS_TRANSITIONS[record.status];
        if (allowedTransitions.length === 0) {
          return <Tag color={ORDER_STATUS_COLORS[record.status]}>{record.status}</Tag>;
        }
        return (
          <Select
            value={record.status}
            size="small"
            style={{ width: 130 }}
            onChange={(val) => onUpdateStatus(record.id, val)}
          >
            <Select.Option value={record.status}>
              <Tag color={ORDER_STATUS_COLORS[record.status]}>{record.status}</Tag>
            </Select.Option>
            {allowedTransitions.map((s) => (
              <Select.Option key={s} value={s}>
                <Tag color={ORDER_STATUS_COLORS[s]}>{s}</Tag>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Chi tiết',
      key: 'action',
      width: 90,
      render: (_: any, record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onViewDetail(record)}
        >
          Xem
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
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm khách hàng..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
              size="large"
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Lọc trạng thái"
              allowClear
              size="large"
              style={{ width: '100%' }}
              onChange={(val) => setStatusFilter(val)}
            >
              {ORDER_STATUSES.map((s) => (
                <Select.Option key={s} value={s}>
                  <Tag color={ORDER_STATUS_COLORS[s]}>{s}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              size="large"
              style={{ width: '100%', borderRadius: 8 }}
              onChange={(dates) => setDateRange(dates as any)}
              format="DD/MM/YYYY"
            />
          </Col>
        </Row>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        className="order-table"
      />
    </div>
  );
};

export default OrderTable;
