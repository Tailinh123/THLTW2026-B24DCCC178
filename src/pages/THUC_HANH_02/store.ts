
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { gameSlice } from './Bai_1/slices';
import { danhMucSlice, cauHoiSlice, deThiSlice } from './Bai_2/slices';
import { lsGet, lsSet } from './common';


const LS_KEYS = {
  game: 'game',
  danhMuc: 'danhMuc',
  cauHoi: 'cauHoi',
  deThi: 'deThi',
} as const;


const loadPreloadedState = () => {
  return {
    game: lsGet(LS_KEYS.game, undefined),
    danhMuc: lsGet(LS_KEYS.danhMuc, undefined),
    cauHoi: lsGet(LS_KEYS.cauHoi, undefined),
    deThi: lsGet(LS_KEYS.deThi, undefined),
  };
};


const localStorageMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState();

  try {
    lsSet(LS_KEYS.game, state.game);
    lsSet(LS_KEYS.danhMuc, state.danhMuc);
    lsSet(LS_KEYS.cauHoi, state.cauHoi);
    lsSet(LS_KEYS.deThi, state.deThi);
  } catch (e) {
    console.warn('[TH01] Store sync failed:', e);
  }

  return result;
};


const preloaded = loadPreloadedState();

const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    danhMuc: danhMucSlice.reducer,
    cauHoi: cauHoiSlice.reducer,
    deThi: deThiSlice.reducer,
  },
  preloadedState: preloaded as any,
  middleware: (getDefault) => getDefault().concat(localStorageMiddleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
