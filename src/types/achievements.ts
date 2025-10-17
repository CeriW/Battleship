export type AchievementId =
  | 'first_win'
  | 'perfect_game'
  | 'quick_win'
  | 'sniper'
  | 'destroyer_master'
  | 'carrier_hunter'
  | 'comeback_king'
  | 'hard_mode_master'
  | 'win_streak_3'
  | 'win_streak_5'
  | 'win_streak_10'
  | 'games_played_10'
  | 'games_played_50'
  | 'games_played_100'
  | 'corner_specialist'
  | 'center_master'
  | 'edge_warrior'
  | 'lucky_guess'
  | 'strategic_mind'
  | 'patience_master'
  | 'speed_demon'
  | 'accuracy_king'
  | 'battleship_legend'
  | 'submarine_hunter'
  | 'cruiser_slayer'
  | 'battleship_destroyer'
  | 'easy_master'
  | 'medium_master'
  | 'hard_master'
  | 'submarine_expert'
  | 'cruiser_expert'
  | 'battleship_expert'
  | 'easy_expert'
  | 'medium_expert'
  | 'hard_expert'
  | 'first_shot_hit'
  | 'sound_on';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface AchievementProgress {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winStreak: number;
  bestWinStreak: number;
  gamesOnHard: number;
  winsOnHard: number;
  perfectGames: number;
  quickWins: number;
  totalHits: number;
  totalMisses: number;
  totalShots: number;
  shipsSunk: number;
  carriersSunk: number;
  destroyersSunk: number;
  submarinesSunk: number;
  cruisersSunk: number;
  battleshipsSunk: number;
  cornerHits: number;
  centerHits: number;
  edgeHits: number;
  consecutiveHits: number;
  bestConsecutiveHits: number;
  gamesWithComeback: number;
  gamesOnEasy: number;
  winsOnEasy: number;
  gamesOnMedium: number;
  winsOnMedium: number;
  firstShotHits: number;
  soundEnabled: number;
  lastGameStats?: {
    shots: number;
    hits: number;
    misses: number;
    timeToWin?: number;
    shipsSunk: number;
    perfectGame: boolean;
    quickWin: boolean;
    noMissGame: boolean;
  };
}

export interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
  read: boolean;
}
