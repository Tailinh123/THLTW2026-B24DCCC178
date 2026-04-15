import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudyState, Category, StudyLog, MonthlyGoal } from '../../types';

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Toán", color: "#1677ff", icon: "📐" },
  { id: "cat-2", name: "Văn", color: "#52c41a", icon: "✍️" },
  { id: "cat-3", name: "Anh", color: "#fa8c16", icon: "🌐" },
  { id: "cat-4", name: "Lý", color: "#eb2f96", icon: "⚡" },
  { id: "cat-5", name: "Hóa", color: "#722ed1", icon: "🧪" },
];

const initialState: StudyState = {
  categories: defaultCategories,
  logs: [],
  goals: [],
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const idx = state.categories.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = action.payload;
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    addLog(state, action: PayloadAction<StudyLog>) {
      state.logs.push(action.payload);
    },
    updateLog(state, action: PayloadAction<StudyLog>) {
      const idx = state.logs.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) state.logs[idx] = action.payload;
    },
    deleteLog(state, action: PayloadAction<string>) {
      state.logs = state.logs.filter(l => l.id !== action.payload);
    },
    setGoal(state, action: PayloadAction<MonthlyGoal>) {
      const idx = state.goals.findIndex(g => g.id === action.payload.id);
      if (idx !== -1) state.goals[idx] = action.payload;
      else state.goals.push(action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory, addLog, updateLog, deleteLog, setGoal } = studySlice.actions;
export default studySlice.reducer;
