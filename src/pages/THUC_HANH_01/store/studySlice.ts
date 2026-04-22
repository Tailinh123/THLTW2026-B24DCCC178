import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackerState, SubjectCategory, StudySession } from '../types';
import moment from 'moment';

const initialState: TrackerState = {
  categories: [
    {
      id: 'm1',
      name: 'Toán Cao Cấp',
      color: '#6366f1',
      icon: 'calculator',
      goalHours: 20,
    },
    {
      id: 'm2',
      name: 'Lập Trình Web',
      color: '#a855f7',
      icon: 'laptop',
      goalHours: 30,
    },
  ],
  sessions: [
    {
      id: 'ses_001',
      categoryId: 'm1',
      date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      durationHours: 2.5,
      content: 'Giải tích vi phân - Đạo hàm riêng',
      notes: 'Cần ôn lại phần ứng dụng đạo hàm',
    },
    {
      id: 'ses_002',
      categoryId: 'm2',
      date: moment().subtract(2, 'day').format('YYYY-MM-DD'),
      durationHours: 3,
      content: 'React Hooks & State Management',
      notes: 'Hoàn thành bài tập useReducer',
    },
    {
      id: 'ses_003',
      categoryId: 'm1',
      date: moment().subtract(4, 'day').format('YYYY-MM-DD'),
      durationHours: 1.5,
      content: 'Tích phân bội - Chương 5',
    },
  ],
  monthlyGoalHours: 50,
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    setMonthlyGoal: (state, action: PayloadAction<number>) => {
      state.monthlyGoalHours = action.payload;
    },
    addCategory: (state, action: PayloadAction<SubjectCategory>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<SubjectCategory>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.categories[index] = action.payload;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      state.sessions = state.sessions.filter((s) => s.categoryId !== action.payload);
    },
    addSession: (state, action: PayloadAction<StudySession>) => {
      state.sessions.unshift(action.payload);
    },
    updateSession: (state, action: PayloadAction<StudySession>) => {
      const index = state.sessions.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.sessions[index] = action.payload;
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
    },
  },
});

export const {
  setMonthlyGoal,
  addCategory,
  updateCategory,
  deleteCategory,
  addSession,
  updateSession,
  deleteSession,
} = studySlice.actions;
export default studySlice.reducer;
