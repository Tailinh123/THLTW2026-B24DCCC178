



import type { WorkoutEntry, Goal } from '../types';


export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 100) / 100;
};


export const getBMICategory = (
  bmi: number,
): { label: string; color: string } => {
  if (bmi <= 0) return { label: 'N/A', color: 'default' };
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};


export const calculateStreak = (workouts: WorkoutEntry[]): number => {
  const completedDates = new Set(
    workouts
      .filter((w) => w.status === 'completed')
      .map((w) => w.date),
  );

  let streak = 0;
  const d = new Date();
  
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (completedDates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (streak === 0) {
      
      d.setDate(d.getDate() - 1);
      const yKey = d.toISOString().split('T')[0];
      if (completedDates.has(yKey)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return streak;
};


export const getMonthlyStats = (
  workouts: WorkoutEntry[],
): { totalSessions: number; totalCalories: number } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const thisMonth = workouts.filter((w) => {
    const d = new Date(w.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      w.status === 'completed'
    );
  });

  return {
    totalSessions: thisMonth.length,
    totalCalories: thisMonth.reduce((sum, w) => sum + w.calories, 0),
  };
};


export const getWeeklyWorkoutCounts = (
  workouts: WorkoutEntry[],
): { week: string; count: number }[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const weeks: { week: string; count: number }[] = [];
  let weekStart = new Date(firstDay);
  let weekNum = 1;

  while (weekStart <= lastDay) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    const count = workouts.filter((w) => {
      return (
        w.date >= startStr &&
        w.date <= endStr &&
        w.status === 'completed'
      );
    }).length;

    weeks.push({ week: `Tuần ${weekNum}`, count });
    weekNum++;
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1);
  }

  return weeks;
};


export const getGoalProgress = (goal: Goal): number => {
  if (goal.targetValue <= 0) return 0;

  
  if (goal.type === 'weight_loss') {
    
    
    if (goal.currentValue <= goal.targetValue) return 100;
    
    
    
    const diff = goal.currentValue - goal.targetValue;
    const pct = Math.max(0, Math.round(((goal.targetValue - diff) / goal.targetValue) * 100));
    return Math.min(pct, 100);
  }

  const pct = Math.round((goal.currentValue / goal.targetValue) * 100);
  return Math.min(pct, 100);
};


export const getCompletedGoalsPercent = (goals: Goal[]): number => {
  if (goals.length === 0) return 0;
  const completed = goals.filter((g) => g.status === 'completed').length;
  return Math.round((completed / goals.length) * 100);
};
