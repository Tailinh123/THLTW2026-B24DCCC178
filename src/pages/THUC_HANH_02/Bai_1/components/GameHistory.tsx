/* ============================================================
 * GameHistory — Bảng lịch sử các phiên chơi
 * ============================================================ */
import React from 'react';
import { Card, Table, Button, Tag, Empty, Popconfirm, Typography, message } from 'antd';
import { HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameActions } from '../slices';
import { formatDate } from '../../common';
import type { GameMode } from '../types';
import { MODE_LABEL } from '../types';

const { Text } = Typography;

export const GameHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useAppSelector((s) => s.game.history);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Chế độ',
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (m: GameMode) => <Tag>{MODE_LABEL[m]}</Tag>,
    },
    {
      title: 'Kết quả',
      dataIndex: 'winner',
      key: 'winner',
      width: 100,
      render: (w: string) => {
        const color = w === 'player' ? 'green' : w === 'computer' ? 'red' : 'gold';
        const text = w === 'player' ? 'Thắng' : w === 'computer' ? 'Thua' : 'Hòa';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tỉ số',
      key: 'score',
      width: 80,
      render: (_: any, r: any) => (
        <Text style={{ color: '#fff' }}>
          {r.playerScore} - {r.computerScore}
        </Text>
      ),
    },
    {
      title: 'Số lượt',
      dataIndex: 'rounds',
      key: 'rounds',
      width: 80,
      render: (rounds: any[]) => rounds.length,
    },
    {
      title: 'Thời gian',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (v: string) => (
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{formatDate(v)}</Text>
      ),
    },
  ];

  return (
    <Card
      className="game-card"
      title={
        <span style={{ color: '#faad14' }}>
          <HistoryOutlined /> Lịch sử ({history.length})
        </span>
      }
      extra={
        history.length > 0 && (
          <Popconfirm
            title="Xóa toàn bộ lịch sử?"
            onConfirm={() => {
              dispatch(gameActions.clearHistory());
              message.success('Đã xóa lịch sử');
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" icon={<DeleteOutlined />} danger type="text">
              Xóa
            </Button>
          </Popconfirm>
        )
      }
    >
      {history.length === 0 ? (
        <Empty description="Chưa có lịch sử" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5, size: 'small' }}
          className="game-table"
        />
      )}
    </Card>
  );
};
