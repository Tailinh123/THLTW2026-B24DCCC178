import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addCategory, updateCategory, deleteCategory,
  addLog, updateLog, deleteLog,
  setGoal
} from '../redux/slices/studySlice';
import { Category, StudyLog, MonthlyGoal } from '../types';
import dayjs from 'dayjs';

export const useStudy = () => {
  const dispatch = useDispatch();
  const { categories, logs, goals } = useSelector((state: RootState) => state.study);

  const getMonthLogs = useCallback((monthKey: string) =>
    logs.filter(l => dayjs(l.startTime).format("YYYY-MM") === monthKey),
    [logs]
  );

  const getMonthMinutes = useCallback((monthKey: string) =>
    getMonthLogs(monthKey).reduce((sum, l) => sum + l.duration, 0),
    [getMonthLogs]
  );

  const getGoal = useCallback((monthKey: string) =>
    goals.find(g => g.id === monthKey),
    [goals]
  );

  return {
    categories, logs, goals,
    getMonthLogs, getMonthMinutes, getGoal,
    addCategory: (cat: Category) => dispatch(addCategory(cat)),
    updateCategory: (cat: Category) => dispatch(updateCategory(cat)),
    deleteCategory: (id: string) => dispatch(deleteCategory(id)),
    addLog: (log: StudyLog) => dispatch(addLog(log)),
    updateLog: (log: StudyLog) => dispatch(updateLog(log)),
    deleteLog: (id: string) => dispatch(deleteLog(id)),
    setGoal: (goal: MonthlyGoal) => dispatch(setGoal(goal)),
  };
};
