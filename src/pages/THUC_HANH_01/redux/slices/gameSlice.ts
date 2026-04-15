import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../../types';

const initialState: GameState = {
  target: null,
  guesses: [],
  attemptsLeft: 10,
  status: 'idle',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      state.target = Math.floor(Math.random() * 100) + 1;
      state.guesses = [];
      state.attemptsLeft = 10;
      state.status = 'playing';
    },
    makeGuess(state, action: PayloadAction<number>) {
      const value = action.payload;
      const attempt = 10 - state.attemptsLeft + 1;
      let result: 'too_low' | 'too_high' | 'correct';

      if (value < state.target!) result = 'too_low';
      else if (value > state.target!) result = 'too_high';
      else result = 'correct';

      state.guesses.push({ value, result, attempt });
      state.attemptsLeft -= 1;

      if (result === 'correct') state.status = 'won';
      else if (state.attemptsLeft === 0) state.status = 'lost';
    },
    resetGame(state) {
      state.target = null;
      state.guesses = [];
      state.attemptsLeft = 10;
      state.status = 'idle';
    },
  },
});

export const { startGame, makeGuess, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
