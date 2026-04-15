import React, { useState } from 'react';
import { Card, Space, Button, Empty, Row, Col, Statistic, Progress, InputNumber, Alert, Timeline, Tag, Typography, notification } from 'antd';
import { TrophyOutlined, FireOutlined, ReloadOutlined, BulbOutlined, ClockCircleOutlined, OrderedListOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';

const { Text } = Typography;

export default function GameModule() {
  const game = useGame();
  const [inputVal, setInputVal] = useState<number | null>(null);

  const handleGuess = () => {
    if (!inputVal || inputVal < 1 || inputVal > 100) {
      notification.warning({ message: "Nhập số từ 1 đến 100!" });
      return;
    }
    const last = game.guesses[game.guesses.length - 1];
    if (last && last.value === inputVal) {
      notification.info({ message: "Bạn vừa đoán số này rồi!" });
      return;
    }
    game.guess(inputVal);
    
    const attemptResult = inputVal < game.target! ? "too_low" : inputVal > game.target! ? "too_high" : "correct";
    
    if (attemptResult === "correct") {
      notification.success({
        message: "🎉 Chính xác!",
        description: `Bạn đoán đúng số ${inputVal} sau ${game.guesses.length + 1} lần!`,
        duration: 4,
      });
    } else if (game.attemptsLeft === 1) {
      notification.error({ message: "💀 Hết lượt!", description: `Đáp án là ${game.target}`, duration: 5 });
    } else {
      notification.info({
        message: attemptResult === "too_low" ? "📉 Thấp hơn!" : "📈 Cao hơn!",
        description: `Còn ${game.attemptsLeft - 1} lượt`,
      });
    }
    setInputVal(null);
  };

  const statusColor: Record<string, string> = { idle: '#bfbfbf', playing: '#1890ff', won: '#52c41a', lost: '#f5222d' };
  const progressPct = Math.round(((10 - game.attemptsLeft) / 10) * 100);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<Space><TrophyOutlined style={{ color: '#faad14' }} /><span>Number Guessing Game</span></Space>}
            extra={
              <Space>
                {game.status !== "idle" && (
                  <Button icon={<ReloadOutlined />} onClick={game.reset}>Reset</Button>
                )}
                {(game.status === "idle" || game.status === "won" || game.status === "lost") && (
                  <Button type="primary" icon={<FireOutlined />} onClick={game.start}>
                    {game.status === "idle" ? "Bắt đầu" : "Chơi lại"}
                  </Button>
                )}
              </Space>
            }
          >
            {game.status === "idle" && (
              <Empty
                image={<BulbOutlined style={{ fontSize: 48, color: '#faad14' }} />}
                description={
                  <Space direction="vertical" align="center">
                    <Text>Đoán số ngẫu nhiên từ 1 đến 100</Text>
                    <Text type="secondary">Bạn có tối đa 10 lần đoán</Text>
                  </Space>
                }
              />
            )}

            {game.status !== "idle" && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic 
                    title="Lượt còn lại" 
                    value={game.attemptsLeft}
                    prefix={<ClockCircleOutlined />} 
                    valueStyle={{ color: game.attemptsLeft <= 3 ? '#f5222d' : '#1890ff' }} 
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic title="Số đã đoán" value={game.guesses.length} prefix={<OrderedListOutlined />} />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic title="Trạng thái"
                    value={game.status === "playing" ? "Đang chơi" : game.status === "won" ? "Thắng! 🎉" : "Thua 💀"}
                    valueStyle={{ color: statusColor[game.status] }} />
                </Col>

                <Col span={24}>
                  <Text type="secondary">Tiến trình lượt đoán</Text>
                  <Progress
                    percent={progressPct}
                    strokeColor={game.attemptsLeft <= 3 ? '#f5222d' : '#1890ff'}
                    showInfo={false} style={{ marginTop: 4 }}
                  />
                </Col>

                {game.status === "playing" && (
                  <Col span={24}>
                    <InputNumber
                      size="large"
                      min={1} max={100}
                      value={inputVal}
                      onChange={setInputVal}
                      placeholder="Nhập số từ 1 → 100"
                      onPressEnter={handleGuess}
                      style={{ width: "calc(100% - 100px)", marginRight: 8 }}
                    />
                    <Button size="large" type="primary" onClick={handleGuess}>Đoán!</Button>
                  </Col>
                )}

                {(game.status === "won" || game.status === "lost") && (
                  <Col span={24}>
                    <Alert
                      type={game.status === "won" ? "success" : "error"}
                      message={game.status === "won"
                        ? `🎊 Tuyệt vời! Bạn đã đoán đúng số ${game.target} sau ${game.guesses.length} lần!`
                        : `😢 Hết lượt! Đáp án là ${game.target}`}
                      showIcon
                    />
                  </Col>
                )}
              </Row>
            )}
          </Card>
        </Col>

        {game.guesses.length > 0 && (
          <Col span={24}>
            <Card title={<Space><OrderedListOutlined /><span>Lịch sử đoán</span></Space>} size="small">
              <Timeline>
                {[...game.guesses].reverse().map((g, i) => (
                  <Timeline.Item 
                    key={i}
                    color={g.result === "correct" ? "green" : g.result === "too_low" ? "blue" : "red"}
                    dot={g.result === "correct" ? <CheckCircleOutlined style={{ fontSize: 16 }} /> : 
                        (g.result === "too_low" ? <span style={{ fontSize: 12 }}>↑</span> : <span style={{ fontSize: 12 }}>↓</span>)}
                  >
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>{g.value}</Text>
                      <Tag color={g.result === "correct" ? "success" : g.result === "too_low" ? "processing" : "error"}>
                        {g.result === "correct" ? "Đúng rồi!" : g.result === "too_low" ? "Thấp hơn" : "Cao hơn"}
                      </Tag>
                      <Text type="secondary">Lần {g.attempt}</Text>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
