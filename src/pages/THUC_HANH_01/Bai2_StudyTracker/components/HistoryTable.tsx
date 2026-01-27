import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { deleteSession } from '../../store/studySlice';

interface Props {
  onEditSession: (id: string) => void;
}


const HistoryTable: React.FC<Props> = ({ onEditSession }) => {
  const dispatch = useDispatch();
  const { sessions, categories } = useSelector((state: RootState) => state.study);

  const handleDelete = (id: string) => {
    dispatch(deleteSession(id));
    notification.success({ message: 'Đã xóa phiên học' });
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (id: string) => {
        const cat = categories.find(c => c.id === id);
        return cat ? <Tag color={cat.color}>{cat.name}</Tag> : <Tag>N/A</Tag>;
      }
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ học',
      dataIndex: 'durationHours',
      key: 'durationHours',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => onEditSession(record.id)}
          />
          <Popconfirm title="Xóa phiên học này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table dataSource={sessions} columns={columns} rowKey="id" />;
};

export default HistoryTable;
