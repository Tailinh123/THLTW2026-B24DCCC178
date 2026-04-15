

export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw';
export type GameMode = 'free' | 'bo3' | 'bo5';

export interface GameRound {
  id: string;
  playerChoice: Choice;
  computerChoice: Choice;
  result: GameResult;
  playedAt: string;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  rounds: GameRound[];
  status: 'playing' | 'finished';
  winner?: 'player' | 'computer' | 'draw';
  playerScore: number;
  computerScore: number;
  startedAt: string;
  finishedAt?: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  choiceDistribution: Record<Choice, number>;
}



export const CHOICE_EMOJI: Record<Choice, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

export const CHOICE_LABEL: Record<Choice, string> = {
  rock: 'Búa',
  paper: 'Bao',
  scissors: 'Kéo',
};

export const RESULT_LABEL: Record<GameResult, string> = {
  win: 'Thắng',
  lose: 'Thua',
  draw: 'Hòa',
};

export const RESULT_COLOR: Record<GameResult, string> = {
  win: '#52c41a',
  lose: '#ff4d4f',
  draw: '#faad14',
};

export const MODE_LABEL: Record<GameMode, string> = {
  free: 'Chơi tự do',
  bo3: 'Best of 3',
  bo5: 'Best of 5',
};

export const MODE_WIN_NEED: Record<GameMode, number> = {
  free: Infinity,
  bo3: 2,
  bo5: 3,
};



const BEATS: Record<Choice, Choice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export const getComputerChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * 3)];
};

export const getResult = (player: Choice, computer: Choice): GameResult => {
  if (player === computer) return 'draw';
  return BEATS[player] === computer ? 'win' : 'lose';
};

export const calcStats = (sessions: GameSession[]): GameStats => {
  const finished = sessions.filter((s) => s.status === 'finished');
  const wins = finished.filter((s) => s.winner === 'player').length;
  const losses = finished.filter((s) => s.winner === 'computer').length;
  const draws = finished.filter((s) => s.winner === 'draw').length;
  const total = finished.length;

  let currentStreak = 0;
  let bestStreak = 0;
  let streak = 0;
  for (const s of finished) {
    if (s.winner === 'player') {
      streak++;
      if (streak > bestStreak) bestStreak = streak;
    } else {
      streak = 0;
    }
  }
  currentStreak = streak;

  const dist: Record<Choice, number> = { rock: 0, paper: 0, scissors: 0 };
  sessions.forEach((s) =>
    s.rounds.forEach((r) => {
      dist[r.playerChoice]++;
    }),
  );

  return {
    totalGames: total,
    wins,
    losses,
    draws,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
    currentStreak,
    bestStreak,
    choiceDistribution: dist,
  };
};
