
import React, { useState, useEffect } from 'react';
import { Modal, Button, Tag, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameActions } from '../slices';
import { CHOICE_EMOJI, CHOICE_LABEL, RESULT_LABEL, RESULT_COLOR } from '../types';

const { Title, Text } = Typography;


interface CountdownProps {
  onFinish: () => void;
}

export const CountdownOverlay: React.FC<CountdownProps> = ({ onFinish }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onFinish();
      return;
    }
    const t = setTimeout(() => setCount(count - 1), 600);
    return () => clearTimeout(t);
  }, [count, onFinish]);

  return (
    <div className="countdown-overlay">
      <div className="countdown-number" key={count}>
        {count > 0 ? count : 'GO!'}
      </div>
    </div>
  );
};


export const ResultDisplay: React.FC = () => {
  const session = useAppSelector((s) => s.game.currentSession);
  if (!session || session.rounds.length === 0) return null;

  const lastRound = session.rounds[session.rounds.length - 1];
  const r = lastRound.result;

  const resultClass =
    r === 'win' ? 'result-win' : r === 'lose' ? 'result-lose' : 'result-draw';

  const tagColors: Record<string, string> = {
    win: '#34d399',
    lose: '#f87171',
    draw: '#fbbf24',
  };

  return (
    <div className={`result-display ${resultClass}`}>
      <div className="result-hands">
        <div className="result-hand result-hand-player">
          <div className="result-emoji">{CHOICE_EMOJI[lastRound.playerChoice]}</div>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 }}>
            {CHOICE_LABEL[lastRound.playerChoice]}
          </Text>
        </div>
        <div className="result-badge">
          <Tag
            color={tagColors[r]}
            style={{
              fontSize: 15,
              padding: '5px 20px',
              fontWeight: 700,
              borderRadius: 24,
              border: 'none',
              letterSpacing: 1,
            }}
          >
            {RESULT_LABEL[r].toUpperCase()}
          </Tag>
        </div>
        <div className="result-hand result-hand-computer">
          <div className="result-emoji">{CHOICE_EMOJI[lastRound.computerChoice]}</div>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 }}>
            {CHOICE_LABEL[lastRound.computerChoice]}
          </Text>
        </div>
      </div>
    </div>
  );
};


export const SessionFinishedModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((s) => s.game.currentSession);
  const visible = session?.status === 'finished';
  if (!session || !visible) return null;

  const isWin = session.winner === 'player';
  const isDraw = session.winner === 'draw';

  const headerColor = isWin ? '#34d399' : isDraw ? '#fbbf24' : '#f87171';

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      centered
      bodyStyle={{
        textAlign: 'center',
        padding: '44px 28px',
        background: 'linear-gradient(145deg, #1a1333 0%, #0d1b2a 100%)',
        borderRadius: 16,
        border: `1px solid ${headerColor}22`,
      }}
      width={420}
    >
      <div className={`finish-modal ${isWin ? 'finish-win' : isDraw ? 'finish-draw' : 'finish-lose'}`}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {isWin ? '🎉' : isDraw ? '🤝' : '😢'}
        </div>
        <Title
          level={3}
          style={{
            margin: 0,
            background: `linear-gradient(135deg, ${headerColor}, ${headerColor}aa)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}
        >
          {isWin ? 'BẠN THẮNG!' : isDraw ? 'HÒA!' : 'MÁY THẮNG!'}
        </Title>
        <Text
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 18,
            display: 'block',
            margin: '10px 0 28px',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {session.playerScore} — {session.computerScore}
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<ReloadOutlined />}
          onClick={() => dispatch(gameActions.resetSession())}
          className="game-btn"
          style={{ borderRadius: 12 }}
        >
          Chơi lại
        </Button>
      </div>
    </Modal>
  );
};
