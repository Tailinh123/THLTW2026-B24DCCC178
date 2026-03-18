import React, { useState } from 'react';
import { Card, Avatar, Rate, Space, Typography, Button, Input, Empty, Tag } from 'antd';
import { MOCK_EMPLOYEES } from '../types';
import type { Review } from '../types';

const { Text } = Typography;

interface Props {
  reviews: Review[];
  onReply: (id: string, content: string) => void;
}

const ReviewList: React.FC<Props> = ({ reviews, onReply }) => {
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (reviews.length === 0) return <Empty description="Chưa có đánh giá nào" style={{ padding: 24 }} />;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={10}>
      {reviews.map(r => {
        const emp = MOCK_EMPLOYEES.find(e => e.id === r.employeeId);
        const label = r.rating === 5 ? ['Xuất sắc','green'] : r.rating === 4 ? ['Tốt','blue'] : ['Bình thường','orange'];
        return (
          <Card key={r.id} size="small" style={{ background: '#fafafa', borderRadius: 10 }}>
            <Space align="start" style={{ width: '100%' }}>
              <Avatar size={38} style={{ background: '#6c63ff', flexShrink: 0 }}>{r.customerName[0]}</Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <Text strong>{r.customerName}</Text>
                  <Space size={6}>
                    <Rate disabled value={r.rating} style={{ fontSize: 12 }} />
                    <Tag color={label[1]} style={{ margin: 0 }}>{label[0]}</Tag>
                  </Space>
                </div>
                <Text style={{ display: 'block', marginTop: 4 }}>{r.comment}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  {emp && ` · ${emp.name}`}
                </Text>

                {r.reply ? (
                  <div style={{ marginTop: 8, padding: '6px 12px', background: '#ede9fe', borderRadius: 8, borderLeft: '3px solid #6c63ff' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Phản hồi: </Text>
                    <Text style={{ fontSize: 13 }}>{r.reply.content}</Text>
                  </div>
                ) : replyingId === r.id ? (
                  <div style={{ marginTop: 8 }}>
                    <Input.TextArea rows={2} value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Nhập phản hồi..." style={{ marginBottom: 8 }} />
                    <Space>
                      <Button size="small" type="primary" disabled={!replyText.trim()}
                        onClick={() => { onReply(r.id, replyText); setReplyingId(null); setReplyText(''); }}>
                        Gửi
                      </Button>
                      <Button size="small" onClick={() => setReplyingId(null)}>Hủy</Button>
                    </Space>
                  </div>
                ) : (
                  <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }}
                    onClick={() => { setReplyingId(r.id); setReplyText(''); }}>
                    ↩ Trả lời
                  </Button>
                )}
              </div>
            </Space>
          </Card>
        );
      })}
    </Space>
  );
};

export default ReviewList;