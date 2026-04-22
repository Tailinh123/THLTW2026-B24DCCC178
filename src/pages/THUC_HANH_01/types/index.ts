export interface GameHistoryEntry {
  guess: number;
  status: 'high' | 'low' | 'correct';
}

export interface GameRecord {
  bestAttempts: number | null;
  gamesPlayed: number;
  gamesWon: number;
}

export interface GameState {
  targetNumber: number;
  attemptsLeft: number;
  history: GameHistoryEntry[];
  status: 'playing' | 'won' | 'lost';
  lastFeedback: string;
  records: GameRecord;
}

export interface SubjectCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  goalHours?: number;
}

export interface StudySession {
  id: string;
  categoryId: string;
  date: string;
  durationHours: number;
  content: string;
  notes?: string;
}

export interface TrackerState {
  categories: SubjectCategory[];
  sessions: StudySession[];
  monthlyGoalHours: number;
}
