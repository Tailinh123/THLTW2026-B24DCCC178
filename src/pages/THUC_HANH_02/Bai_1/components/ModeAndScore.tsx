
import React from 'react';
import { Card, Radio, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
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
        <Text strong style={{ fontSize: 14, color: '#d4a017', display: 'block', marginBottom: 12 }}>
          <ThunderboltOutlined /> CHẾ ĐỘ CHƠI
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



export const ScoreBoard: React.FC = () => {
  const session = useAppSelector((s) => s.game.currentSession);
  if (!session) return null;

  const modeLabel = MODE_LABEL[session.mode];
  const roundNum = session.rounds.length;

  return (
    <Card size="small" className="game-card game-score-card">
      <div style={{ textAlign: 'center' }}>
        <span style={{ display: 'inline-block', marginBottom: 8, fontSize: 12, color: '#faad14', background: 'rgba(250,173,20,0.1)', padding: '2px 12px', borderRadius: 10, border: '1px solid rgba(250,173,20,0.3)' }}>
          {modeLabel}
        </span>
        <div className="score-display">
          <div className="score-side score-player">
            <Text className="score-label">BẠN</Text>
            <div className="score-number">{session.playerScore}</div>
          </div>
          <div className="score-vs">
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: 700 }}>VS</Text>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, display: 'block' }}>
              Lượt {roundNum}
            </Text>
          </div>
          <div className="score-side score-computer">
            <Text className="score-label">MÁY</Text>
            <div className="score-number">{session.computerScore}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
