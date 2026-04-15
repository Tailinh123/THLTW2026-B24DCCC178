/* ============================================================
 * GameBoard — Layout chính của game
 * HandSelector — 3 nút chọn Kéo/Búa/Bao với animation
 * ============================================================ */
import React, { useState, useCallback } from 'react';
import { Card, Button, Tooltip, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { gameActions } from '../slices';
import type { Choice } from '../types';
import { CHOICE_EMOJI, CHOICE_LABEL, MODE_LABEL } from '../types';
import { CountdownOverlay, ResultDisplay, SessionFinishedModal } from './GameFeedback';

const { Title, Text } = Typography;

/* =============================================================
 * HAND SELECTOR — 3 nút chọn Kéo/Búa/Bao
 * ============================================================= */
export const HandSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((s) => s.game.currentSession);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);

  const handleSelect = useCallback(
    (choice: Choice) => {
      if (!session || session.status === 'finished') return;
      setPendingChoice(choice);
      setShowCountdown(true);
    },
    [session],
  );

  const handleCountdownFinish = useCallback(() => {
    setShowCountdown(false);
    if (pendingChoice) {
      dispatch(gameActions.playRound(pendingChoice));
      setPendingChoice(null);
    }
  }, [pendingChoice, dispatch]);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const disabled = !session || session.status === 'finished' || showCountdown;

  return (
    <>
      {showCountdown && <CountdownOverlay onFinish={handleCountdownFinish} />}
      <div className="hand-selector">
        {choices.map((c) => (
          <Tooltip title={CHOICE_LABEL[c]} key={c}>
            <button
              className={`hand-btn ${pendingChoice === c ? 'hand-btn-selected' : ''} ${disabled ? 'hand-btn-disabled' : ''}`}
              onClick={() => handleSelect(c)}
              disabled={disabled}
            >
              <span className="hand-emoji">{CHOICE_EMOJI[c]}</span>
              <span className="hand-label">{CHOICE_LABEL[c]}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </>
  );
};

/* =============================================================
 * GAME BOARD — Layout chính của game
 * ============================================================= */
export const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSession, selectedMode } = useAppSelector((s) => s.game);
  const isPlaying = currentSession && currentSession.status === 'playing';

  return (
    <Card className="game-card game-board-card" bodyStyle={{ padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ color: '#faad14', margin: 0 }}>
          🎮 OẲN TÙ TÌ
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Chọn Kéo, Búa hoặc Bao!</Text>
      </div>

      {!isPlaying ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => dispatch(gameActions.startSession())}
            className="game-btn game-start-btn"
          >
            BẮT ĐẦU CHƠI ({MODE_LABEL[selectedMode]})
          </Button>
        </div>
      ) : (
        <>
          <HandSelector />
          <ResultDisplay />
          {currentSession?.mode === 'free' && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button
                icon={<PauseCircleOutlined />}
                onClick={() => dispatch(gameActions.endFreeSession())}
                className="game-btn-secondary"
              >
                Kết thúc phiên
              </Button>
            </div>
          )}
        </>
      )}
      <SessionFinishedModal />
    </Card>
  );
};
