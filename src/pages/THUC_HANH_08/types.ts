



export type PageKey = 'dashboard' | 'workout-log' | 'health-metrics' | 'goals' | 'exercise-library';

export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'completed' | 'missed';

export type GoalStatus = 'active' | 'completed' | 'failed';
export type GoalType = 'weight_loss' | 'workout_count' | 'calories_burned' | 'running_distance' | 'sleep_hours' | 'other';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type MuscleGroup =
  | 'Ngực'
  | 'Lưng'
  | 'Vai'
  | 'Tay trước'
  | 'Tay sau'
  | 'Chân'
  | 'Bụng'
  | 'Toàn thân'
  | 'Khác';

export interface WorkoutEntry {
  id: string;
  date: string; 
  type: WorkoutType;
  exerciseName: string;
  duration: number; 
  calories: number;
  notes: string;
  status: WorkoutStatus;
}

export interface HealthRecord {
  id: string;
  date: string; 
  weight: number; 
  height: number; 
  bmi: number;
  heartRate: number; 
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string; 
  status: GoalStatus;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  instructions: string;
  caloriesPerHour: number;
}


export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  weight_loss: 'Giảm cân',
  workout_count: 'Số buổi tập',
  calories_burned: 'Calo đốt cháy',
  running_distance: 'Quãng đường chạy',
  sleep_hours: 'Giờ ngủ',
  other: 'Khác',
};

export const WORKOUT_TYPE_COLORS: Record<WorkoutType, string> = {
  Cardio: '#1890ff',
  Strength: '#f5222d',
  Yoga: '#52c41a',
  HIIT: '#fa8c16',
  Other: '#8c8c8c',
};
