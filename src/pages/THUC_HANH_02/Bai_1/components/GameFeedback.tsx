
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

  return (
    <div className={`result-display ${resultClass}`}>
      <div className="result-hands">
        <div className="result-hand result-hand-player">
          <div className="result-emoji">{CHOICE_EMOJI[lastRound.playerChoice]}</div>
          <Text style={{ color: '#fff', fontSize: 12 }}>{CHOICE_LABEL[lastRound.playerChoice]}</Text>
        </div>
        <div className="result-badge">
          <Tag
            color={RESULT_COLOR[r]}
            style={{ fontSize: 16, padding: '4px 16px', fontWeight: 700, borderRadius: 20 }}
          >
            {RESULT_LABEL[r].toUpperCase()}
          </Tag>
        </div>
        <div className="result-hand result-hand-computer">
          <div className="result-emoji">{CHOICE_EMOJI[lastRound.computerChoice]}</div>
          <Text style={{ color: '#fff', fontSize: 12 }}>{CHOICE_LABEL[lastRound.computerChoice]}</Text>
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

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      centered
      bodyStyle={{
        textAlign: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 12,
      }}
      width={400}
    >
      <div className={`finish-modal ${isWin ? 'finish-win' : isDraw ? 'finish-draw' : 'finish-lose'}`}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>
          {isWin ? '🎉' : isDraw ? '🤝' : '😢'}
        </div>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          {isWin ? 'BẠN THẮNG!' : isDraw ? 'HÒA!' : 'MÁY THẮNG!'}
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, display: 'block', margin: '8px 0 24px' }}>
          {session.playerScore} — {session.computerScore}
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<ReloadOutlined />}
          onClick={() => dispatch(gameActions.resetSession())}
          className="game-btn"
        >
          Chơi lại
        </Button>
      </div>
    </Modal>
  );
};
