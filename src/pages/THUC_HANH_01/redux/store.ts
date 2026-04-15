import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import studyReducer from './slices/studySlice';
import { localStorageMiddleware, loadPersistedState } from './middleware/localStorageMiddleware';

const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    game: gameReducer,
    study: studyReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
