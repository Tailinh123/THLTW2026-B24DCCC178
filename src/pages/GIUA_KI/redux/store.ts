// ============================================================
// GIUA_KI — Redux Store with Persist
// ============================================================

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import roomReducer from './slices/roomSlice';
import filterReducer from './slices/filterSlice';
import themeReducer from './slices/themeSlice';
import { PERSIST_KEY } from '../constants';

const rootReducer = combineReducers({
  rooms: roomReducer,
  filters: filterReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: PERSIST_KEY,
  storage,
  whitelist: ['rooms', 'filters', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
