<<<<<<< HEAD




=======
>>>>>>> c7699e0 (THUC_HANH_07)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../types/room';
import { DEFAULT_ROOMS } from '../../constants';

export interface RoomState {
  items: Room[];
  loading: boolean;
  highlightedId: string | null;
}

const initialState: RoomState = {
  items: [],
  loading: false,
  highlightedId: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addRoom(state, action: PayloadAction<Room>) {
      state.items.push(action.payload);
      state.highlightedId = action.payload.id;
    },

    updateRoom(state, action: PayloadAction<Room>) {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.highlightedId = action.payload.id;
      }
    },

    deleteRoom(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
      if (state.highlightedId === action.payload) {
        state.highlightedId = null;
      }
    },

    resetToDefaults(state) {
      state.items = [...DEFAULT_ROOMS];
      state.highlightedId = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    clearHighlight(state) {
      state.highlightedId = null;
    },
  },
});

export const {
  addRoom,
  updateRoom,
  deleteRoom,
  resetToDefaults,
  setLoading,
  clearHighlight,
} = roomSlice.actions;

export default roomSlice.reducer;
