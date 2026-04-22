import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../types';

const MAX_ATTEMPTS = 10;

const generateTarget = () => Math.floor(Math.random() * 100) + 1;

const initialState: GameState = {
  targetNumber: generateTarget(),
  attemptsLeft: MAX_ATTEMPTS,
  history: [],
  status: 'playing',
  lastFeedback: '',
  records: {
    bestAttempts: null,
    gamesPlayed: 0,
    gamesWon: 0,
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeGuess: (state, action: PayloadAction<number>) => {
      if (state.status !== 'playing' || state.attemptsLeft <= 0) return;

      const guess = action.payload;
      state.attemptsLeft -= 1;

      if (guess === state.targetNumber) {
        state.history.unshift({ guess, status: 'correct' });
        state.status = 'won';
        state.lastFeedback = 'Chúc mừng! Bạn đã đoán đúng!';

        const attemptsUsed = MAX_ATTEMPTS - state.attemptsLeft;
        state.records.gamesPlayed += 1;
        state.records.gamesWon += 1;
        if (state.records.bestAttempts === null || attemptsUsed < state.records.bestAttempts) {
          state.records.bestAttempts = attemptsUsed;
        }
      } else {
        const isHigh = guess > state.targetNumber;
        state.history.unshift({ guess, status: isHigh ? 'high' : 'low' });
        state.lastFeedback = isHigh ? 'Bạn đoán quá cao!' : 'Bạn đoán quá thấp!';

        if (state.attemptsLeft === 0) {
          state.status = 'lost';
          state.lastFeedback = `Bạn đã hết lượt! Số đúng là ${state.targetNumber}.`;
          state.records.gamesPlayed += 1;
        }
      }
    },
    resetGame: (state) => {
      state.targetNumber = generateTarget();
      state.attemptsLeft = MAX_ATTEMPTS;
      state.history = [];
      state.status = 'playing';
      state.lastFeedback = '';
    },
  },
});

export const { makeGuess, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
