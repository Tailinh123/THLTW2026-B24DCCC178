export interface GuessEntry {
  value: number;
  result: 'too_low' | 'too_high' | 'correct';
  attempt: number;
}

export interface GameState {
  target: number | null;
  guesses: GuessEntry[];
  attemptsLeft: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface StudyLog {
  id: string;
  categoryId: string;
  startTime: string;
  duration: number;
  content: string;
  note: string;
  createdAt: string;
}

export interface MonthlyGoal {
  id: string; // YYYY-MM
  targetHours: number;
  categoryGoals: Record<string, number>;
}

export interface StudyState {
  categories: Category[];
  logs: StudyLog[];
  goals: MonthlyGoal[];
}
