import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Destination, Itinerary, ItineraryDay, ItineraryItem, BudgetThreshold } from './types';
import { genId } from './types';


interface DestinationsState {
  items: Destination[];
  loading: boolean;
}

const destinationsInitial: DestinationsState = { items: [], loading: false };

export const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: destinationsInitial,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDestinations(state, action: PayloadAction<Destination[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    addDestination(state, action: PayloadAction<Destination>) {
      state.items.push(action.payload);
    },
    updateDestination(state, action: PayloadAction<Destination>) {
      const idx = state.items.findIndex((d) => d.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    deleteDestination(state, action: PayloadAction<string>) {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
  },
});


interface ItineraryState {
  current: Itinerary;
  loading: boolean;
}

const emptyItinerary: Itinerary = {
  id: genId(),
  name: 'Chuyến đi mới',
  days: [],
  createdAt: new Date().toISOString(),
};

const itineraryInitial: ItineraryState = { current: emptyItinerary, loading: false };

export const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState: itineraryInitial,
  reducers: {
    setItinerary(state, action: PayloadAction<Itinerary>) {
      state.current = action.payload;
      state.loading = false;
    },
    setItineraryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateItineraryName(state, action: PayloadAction<string>) {
      state.current.name = action.payload;
    },
    addDay(state) {
      const maxDay = state.current.days.reduce((m, d) => Math.max(m, d.dayNumber), 0);
      state.current.days.push({ id: genId(), dayNumber: maxDay + 1, items: [] });
    },
    removeDay(state, action: PayloadAction<string>) {
      state.current.days = state.current.days.filter((d) => d.id !== action.payload);
      state.current.days.forEach((d, i) => { d.dayNumber = i + 1; });
    },
    addItemToDay(state, action: PayloadAction<{ dayId: string; destinationId: string }>) {
      const day = state.current.days.find((d) => d.id === action.payload.dayId);
      if (day) {
        day.items.push({
          id: genId(),
          destinationId: action.payload.destinationId,
          order: day.items.length,
        });
      }
    },
    removeItemFromDay(state, action: PayloadAction<{ dayId: string; itemId: string }>) {
      const day = state.current.days.find((d) => d.id === action.payload.dayId);
      if (day) {
        day.items = day.items.filter((it) => it.id !== action.payload.itemId);
        day.items.forEach((it, i) => { it.order = i; });
      }
    },
    reorderItems(state, action: PayloadAction<{ dayId: string; items: ItineraryItem[] }>) {
      const day = state.current.days.find((d) => d.id === action.payload.dayId);
      if (day) {
        day.items = action.payload.items.map((it, i) => ({ ...it, order: i }));
      }
    },
    moveItemBetweenDays(
      state,
      action: PayloadAction<{
        sourceDayId: string;
        destDayId: string;
        sourceIndex: number;
        destIndex: number;
      }>,
    ) {
      const { sourceDayId, destDayId, sourceIndex, destIndex } = action.payload;
      const srcDay = state.current.days.find((d) => d.id === sourceDayId);
      const dstDay = state.current.days.find((d) => d.id === destDayId);
      if (srcDay && dstDay) {
        const [moved] = srcDay.items.splice(sourceIndex, 1);
        dstDay.items.splice(destIndex, 0, moved);
        srcDay.items.forEach((it, i) => { it.order = i; });
        dstDay.items.forEach((it, i) => { it.order = i; });
      }
    },
  },
});


interface BudgetState {
  threshold: BudgetThreshold;
}

const budgetInitial: BudgetState = { threshold: { total: 15000000 } };

export const budgetSlice = createSlice({
  name: 'budget',
  initialState: budgetInitial,
  reducers: {
    setThreshold(state, action: PayloadAction<BudgetThreshold>) {
      state.threshold = action.payload;
    },
    updateThreshold(state, action: PayloadAction<Partial<BudgetThreshold>>) {
      state.threshold = { ...state.threshold, ...action.payload };
    },
  },
});


interface AdminState {
  isAuthenticated: boolean;
  username: string | null;
}

const adminInitial: AdminState = { isAuthenticated: false, username: null };

export const adminSlice = createSlice({
  name: 'admin',
  initialState: adminInitial,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.username = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = null;
    },
  },
});


export const destActions = destinationsSlice.actions;
export const itinActions = itinerarySlice.actions;
export const budgetActions = budgetSlice.actions;
export const adminActions = adminSlice.actions;
