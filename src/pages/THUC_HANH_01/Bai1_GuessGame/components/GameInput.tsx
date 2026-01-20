import React, { useRef, useEffect } from 'react';
import { InputNumber, Button } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { makeGuess } from '../../store/gameSlice';
import styles from '../index.less';

const GameInput: React.FC = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.game);
  const [value, setValue] = React.useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'playing') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [status]);

  const handleGuess = () => {
    if (value !== null && value >= 1 && value <= 100) {
      dispatch(makeGuess(value));
      setValue(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGuess();
    }
  };

  return (
    <div className={styles.inputSection}>
      <div className={styles.digitalInput}>
        <InputNumber
          ref={inputRef}
          min={1}
          max={100}
          value={value}
          onChange={(v) => setValue(v as number | null)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập..."
          size="large"
          controls={false}
        />
      </div>
      <Button
        type="primary"
        size="large"
        className={styles.guessButton}
        onClick={handleGuess}
        disabled={value === null}
        icon={<ThunderboltOutlined />}
      >
        ĐOÁN
      </Button>
    </div>
  );
};

export default GameInput;
