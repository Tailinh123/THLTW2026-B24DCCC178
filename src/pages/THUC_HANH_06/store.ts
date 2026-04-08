import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { destinationsSlice, itinerarySlice, budgetSlice, adminSlice } from './slices';

const store = configureStore({
  reducer: {
    destinations: destinationsSlice.reducer,
    itinerary: itinerarySlice.reducer,
    budget: budgetSlice.reducer,
    admin: adminSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
