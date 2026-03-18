/* ============================================================
 * ReviewList — Danh sách đánh giá của khách hàng
 * ============================================================ */
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
        const label = r.rating === 5 ? ['Xuất sắc', 'green'] : r.rating === 4 ? ['Tốt', 'blue'] : ['Bình thường', 'orange'];
        return (
          <Card key={r.id} size="small" className="bb-review-card">
            <Space align="start" style={{ width: '100%' }}>
              <Avatar size={40} style={{ background: '#6366f1', flexShrink: 0, fontWeight: 700, fontSize: 15 }}>{r.customerName[0]}</Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <Text strong style={{ fontSize: 14 }}>{r.customerName}</Text>
                  <Space size={6}>
                    <Rate disabled value={r.rating} style={{ fontSize: 13 }} />
                    <Tag color={label[1]} className="bb-tag">{label[0]}</Tag>
                  </Space>
                </div>
                <Text style={{ display: 'block', marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>{r.comment}</Text>
                <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  {emp && ` · ${emp.name}`}
                </Text>

                {r.reply ? (
                  <div className="bb-review-reply">
                    <Text style={{ fontSize: 12, color: '#64748b' }}>Phản hồi: </Text>
                    <Text style={{ fontSize: 14 }}>{r.reply.content}</Text>
                  </div>
                ) : replyingId === r.id ? (
                  <div style={{ marginTop: 10 }}>
                    <Input.TextArea rows={2} value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Nhập phản hồi..."
                      style={{ marginBottom: 8, borderRadius: 10 }} />
                    <Space>
                      <Button size="small" type="primary"
                        style={{ borderRadius: 8, background: '#6366f1', border: 'none' }}
                        disabled={!replyText.trim()}
                        onClick={() => { onReply(r.id, replyText); setReplyingId(null); setReplyText(''); }}>
                        Gửi
                      </Button>
                      <Button size="small" style={{ borderRadius: 8 }} onClick={() => setReplyingId(null)}>Hủy</Button>
                    </Space>
                  </div>
                ) : (
                  <Button type="link" size="small" style={{ padding: 0, marginTop: 6, color: '#6366f1', fontWeight: 600 }}
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