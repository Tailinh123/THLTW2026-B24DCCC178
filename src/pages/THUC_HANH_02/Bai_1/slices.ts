/* ============================================================
 * THUC_HANH_01 — Bài 1: Game Slice
 * Redux Toolkit slice for Rock-Paper-Scissors game state
 * ============================================================ */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { genId } from '../common';
import type { Choice, GameMode, GameSession, GameRound, GameStats } from './types';
import { getComputerChoice, getResult, calcStats, MODE_WIN_NEED } from './types';

interface GameState {
  currentSession: GameSession | null;
  history: GameSession[];
  selectedMode: GameMode;
}

const initialState: GameState = {
  currentSession: null,
  history: [],
  selectedMode: 'free',
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /* ===== Session Management ===== */
    setMode(state, action: PayloadAction<GameMode>) {
      state.selectedMode = action.payload;
    },

    startSession(state) {
      state.currentSession = {
        id: genId(),
        mode: state.selectedMode,
        rounds: [],
        status: 'playing',
        playerScore: 0,
        computerScore: 0,
        startedAt: new Date().toISOString(),
      };
    },

    /* ===== Play a Round ===== */
    playRound(state, action: PayloadAction<Choice>) {
      if (!state.currentSession || state.currentSession.status === 'finished') return;

      const playerChoice = action.payload;
      const computerChoice = getComputerChoice();
      const result = getResult(playerChoice, computerChoice);

      const round: GameRound = {
        id: genId(),
        playerChoice,
        computerChoice,
        result,
        playedAt: new Date().toISOString(),
      };

      state.currentSession.rounds.push(round);

      if (result === 'win') state.currentSession.playerScore++;
      else if (result === 'lose') state.currentSession.computerScore++;

      const mode = state.currentSession.mode;
      const winNeed = MODE_WIN_NEED[mode];

      if (mode !== 'free') {
        if (state.currentSession.playerScore >= winNeed) {
          state.currentSession.status = 'finished';
          state.currentSession.winner = 'player';
          state.currentSession.finishedAt = new Date().toISOString();
          state.history.unshift({ ...state.currentSession });
        } else if (state.currentSession.computerScore >= winNeed) {
          state.currentSession.status = 'finished';
          state.currentSession.winner = 'computer';
          state.currentSession.finishedAt = new Date().toISOString();
          state.history.unshift({ ...state.currentSession });
        }
      }
    },

    /* ===== End Free Mode Session ===== */
    endFreeSession(state) {
      if (!state.currentSession || state.currentSession.mode !== 'free') return;
      const s = state.currentSession;
      s.status = 'finished';
      s.finishedAt = new Date().toISOString();
      if (s.playerScore > s.computerScore) s.winner = 'player';
      else if (s.computerScore > s.playerScore) s.winner = 'computer';
      else s.winner = 'draw';
      state.history.unshift({ ...s });
      state.currentSession = null;
    },

    /* ===== Reset & Clear ===== */
    resetSession(state) {
      state.currentSession = null;
    },

    clearHistory(state) {
      state.history = [];
    },

    /* ===== Hydrate from LocalStorage ===== */
    hydrateGame(_state, action: PayloadAction<GameState>) {
      return action.payload;
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
