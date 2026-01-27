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
      width: 45,
      render: (_: any, __: any, idx: number) => (
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{idx + 1}</Text>
      ),
    },
    {
      title: 'Chế độ',
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (m: GameMode) => (
        <Tag
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {MODE_LABEL[m]}
        </Tag>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'winner',
      key: 'winner',
      width: 90,
      render: (w: string) => {
        const cfg: Record<string, { bg: string; border: string; color: string; text: string }> = {
          player: {
            bg: 'rgba(52, 211, 153, 0.12)',
            border: 'rgba(52, 211, 153, 0.25)',
            color: '#34d399',
            text: 'Thắng',
          },
          computer: {
            bg: 'rgba(248, 113, 113, 0.12)',
            border: 'rgba(248, 113, 113, 0.25)',
            color: '#f87171',
            text: 'Thua',
          },
          draw: {
            bg: 'rgba(251, 191, 36, 0.12)',
            border: 'rgba(251, 191, 36, 0.25)',
            color: '#fbbf24',
            text: 'Hòa',
          },
        };
        const c = cfg[w] || cfg.draw;
        return (
          <Tag
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.color,
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {c.text}
          </Tag>
        );
      },
    },
    {
      title: 'Tỉ số',
      key: 'score',
      width: 70,
      render: (_: any, r: any) => (
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: 13 }}>
          {r.playerScore} – {r.computerScore}
        </Text>
      ),
    },
    {
      title: 'Lượt',
      dataIndex: 'rounds',
      key: 'rounds',
      width: 55,
      render: (rounds: any[]) => (
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{rounds.length}</Text>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (v: string) => (
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{formatDate(v)}</Text>
      ),
    },
  ];

  return (
    <Card
      className="game-card game-history-card"
      title={
        <span style={{ color: '#818cf8' }}>
          <HistoryOutlined className="card-title-icon" />
          Lịch sử ({history.length})
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
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
              type="text"
              style={{ color: '#f87171', fontSize: 12 }}
            >
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
          pagination={{ pageSize: 4, size: 'small' }}
          className="game-table"
        />
      )}
    </Card>
  );
};
