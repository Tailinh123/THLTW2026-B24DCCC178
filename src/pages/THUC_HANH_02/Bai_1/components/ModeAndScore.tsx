/* ============================================================
 * ModeSelector — Chọn chế độ chơi (Free / Bo3 / Bo5)
 * ScoreBoard — Bảng điểm hiện tại (Player VS Computer)
 * ============================================================ */
import React from 'react';
import { Card, Radio, Typography } from 'antd';
import { ThunderboltOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameActions } from '../slices';
import type { GameMode } from '../types';
import { MODE_LABEL } from '../types';

const { Text } = Typography;

export const ModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedMode, currentSession } = useAppSelector((s) => s.game);
  const disabled = currentSession !== null && currentSession.status === 'playing';

  return (
    <Card size="small" className="game-card game-mode-card">
      <div style={{ textAlign: 'center' }}>
        <Text
          strong
          style={{
            fontSize: 13,
            color: 'rgba(129, 140, 248, 0.9)',
            display: 'block',
            marginBottom: 14,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          <ThunderboltOutlined className="card-title-icon" />
          Chế độ chơi
        </Text>
        <Radio.Group
          value={selectedMode}
          onChange={(e) => dispatch(gameActions.setMode(e.target.value))}
          disabled={disabled}
          buttonStyle="solid"
          size="large"
        >
          {(Object.keys(MODE_LABEL) as GameMode[]).map((m) => (
            <Radio.Button key={m} value={m} className="game-mode-btn">
              {MODE_LABEL[m]}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </Card>
  );
};

/* ============================================================
 * ScoreBoard — Bảng điểm hiện tại (Player VS Computer)
 * ============================================================ */
export const ScoreBoard: React.FC = () => {
  const session = useAppSelector((s) => s.game.currentSession);
  if (!session) return null;

  const modeLabel = MODE_LABEL[session.mode];
  const roundNum = session.rounds.length;

  return (
    <Card size="small" className="game-card game-score-card">
      <div style={{ textAlign: 'center' }}>
        <span className="score-mode-pill">{modeLabel}</span>
        <div className="score-display">
          <div className="score-side score-player">
            <Text className="score-label">
              <UserOutlined style={{ marginRight: 4 }} />
              Bạn
            </Text>
            <div className="score-number">{session.playerScore}</div>
          </div>
          <div className="score-vs">
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              VS
            </Text>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.22)',
                fontSize: 11,
                display: 'block',
                marginTop: 2,
              }}
            >
              Lượt {roundNum}
            </Text>
          </div>
          <div className="score-side score-computer">
            <Text className="score-label">
              <RobotOutlined style={{ marginRight: 4 }} />
              Máy
            </Text>
            <div className="score-number">{session.computerScore}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
