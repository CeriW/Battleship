import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Achievement, AchievementId, AchievementProgress } from '../types/achievements';
import { GameEvents } from '../components/Avatar';

export interface AchievementContextType {
  achievements: Achievement[];
  progress: AchievementProgress;
  unlockedAchievements: Achievement[];
  checkAchievements: (gameEvent: GameEvents, data?: any) => void;
  resetProgress: () => void;
}

const AchievementContext = createContext<AchievementContextType>({} as AchievementContextType);

// Define all achievements
const createAchievements = (): Achievement[] => [
  // Victory Achievements
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Win without missing a single shot',
    icon: '🎯',
    rarity: 'legendary',
    unlocked: false,
  },
  {
    id: 'quick_win',
    name: 'Lightning Strike',
    description: 'Win a game in 20 shots or less',
    icon: '⚡',
    rarity: 'legendary',
    unlocked: false,
  },

  // Strategy Achievements
  {
    id: 'destroyer_master',
    name: 'Destroyer Master',
    description: 'Sink 10 destroyers',
    icon: '🚢',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 10,
  },
  {
    id: 'carrier_hunter',
    name: 'Carrier Hunter',
    description: 'Sink 5 carriers',
    icon: '✈️',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'corner_specialist',
    name: 'Corner Specialist',
    description: 'Hit 20 corner positions (A1, A10, J1, J10)',
    icon: '📐',
    rarity: 'common',
    unlocked: false,
    maxProgress: 20,
  },
  {
    id: 'center_master',
    name: 'Center Master',
    description: 'Hit 30 center positions (D4-D7, E4-E7)',
    icon: '🎯',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 30,
  },

  // Endurance Achievements
  {
    id: 'win_streak_3',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'win_streak_5',
    name: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🔥🔥',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'win_streak_10',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    icon: '🔥🔥🔥',
    rarity: 'legendary',
    unlocked: false,
  },
  {
    id: 'games_played_10',
    name: 'Getting Started',
    description: 'Play 10 games',
    icon: '🎮',
    rarity: 'common',
    unlocked: false,
    maxProgress: 10,
  },
  {
    id: 'games_played_50',
    name: 'Dedicated Player',
    description: 'Play 50 games',
    icon: '🎮🎮',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 50,
  },
  {
    id: 'games_played_100',
    name: 'Battleship Veteran',
    description: 'Play 100 games',
    icon: '🎮🎮🎮',
    rarity: 'legendary',
    unlocked: false,
    maxProgress: 100,
  },

  // Difficulty Achievements
  {
    id: 'hard_mode_master',
    name: 'Hard Mode Master',
    description: 'Win 10 games on hard difficulty',
    icon: '💪',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 10,
  },

  // Special Achievements
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win a game after losing 3 ships',
    icon: '👑',
    rarity: 'uncommon',
    unlocked: false,
  },
  {
    id: 'lucky_guess',
    name: 'Lucky Guess',
    description: 'Get 5 hits in a row',
    icon: '🍀',
    rarity: 'uncommon',
    unlocked: false,
  },
  {
    id: 'battleship_legend',
    name: 'Battleship Legend',
    description: 'Unlock all other achievements',
    icon: '🏆',
    rarity: 'legendary',
    unlocked: false,
  },

  // Ship Type Achievements
  {
    id: 'submarine_hunter',
    name: 'Submarine Hunter',
    description: 'Sink your first submarine',
    icon: '🛸',
    rarity: 'common',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'cruiser_slayer',
    name: 'Cruiser Slayer',
    description: 'Sink your first cruiser',
    icon: '🚢',
    rarity: 'common',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'battleship_destroyer',
    name: 'Battleship Destroyer',
    description: 'Sink your first battleship',
    icon: '⚓',
    rarity: 'common',
    unlocked: false,
    maxProgress: 1,
  },

  // Difficulty Mode Achievements
  {
    id: 'easy_master',
    name: 'Easy Master',
    description: 'Win your first game on easy difficulty',
    icon: '😊',
    rarity: 'common',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'medium_master',
    name: 'Medium Master',
    description: 'Win your first game on medium difficulty',
    icon: '😐',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'hard_master',
    name: 'Hard Master',
    description: 'Win your first game on hard difficulty',
    icon: '😤',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 1,
  },

  // Advanced Ship Type Achievements
  {
    id: 'submarine_expert',
    name: 'Submarine Expert',
    description: 'Sink 5 submarines',
    icon: '🛸🛸',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'cruiser_expert',
    name: 'Cruiser Expert',
    description: 'Sink 5 cruisers',
    icon: '🚢🚢',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'battleship_expert',
    name: 'Battleship Expert',
    description: 'Sink 5 battleships',
    icon: '⚓⚓',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 5,
  },

  // Advanced Difficulty Achievements
  {
    id: 'easy_expert',
    name: 'Easy Expert',
    description: 'Win 5 games on easy difficulty',
    icon: '😊😊',
    rarity: 'common',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'medium_expert',
    name: 'Medium Expert',
    description: 'Win 5 games on medium difficulty',
    icon: '😐😐',
    rarity: 'uncommon',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'hard_expert',
    name: 'Hard Expert',
    description: 'Win 5 games on hard difficulty',
    icon: '😤😤',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'first_shot_hit',
    name: 'First Shot Hit',
    description: 'Get a hit on your first turn',
    icon: '🎯',
    rarity: 'rare',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'sound_on',
    name: 'Sound On',
    description: 'Turn on the sound',
    icon: '🔊',
    rarity: 'common',
    unlocked: false,
    maxProgress: 1,
  },
];

export const AchievementProvider = ({ children }: { children: React.ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('battleship-achievements');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert unlockedAt strings back to Date objects
      return parsed.map((achievement: Achievement) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
      }));
    }
    return createAchievements();
  });

  const [progress, setProgress] = useState<AchievementProgress>(() => {
    const saved = localStorage.getItem('battleship-achievement-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winStreak: 0,
      bestWinStreak: 0,
      gamesOnHard: 0,
      winsOnHard: 0,
      perfectGames: 0,
      quickWins: 0,
      totalHits: 0,
      totalMisses: 0,
      totalShots: 0,
      shipsSunk: 0,
      carriersSunk: 0,
      destroyersSunk: 0,
      submarinesSunk: 0,
      cruisersSunk: 0,
      battleshipsSunk: 0,
      cornerHits: 0,
      centerHits: 0,
      edgeHits: 0,
      consecutiveHits: 0,
      bestConsecutiveHits: 0,
      gamesWithComeback: 0,
      gamesOnEasy: 0,
      winsOnEasy: 0,
      gamesOnMedium: 0,
      winsOnMedium: 0,
      firstShotHits: 0,
      soundEnabled: 0,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('battleship-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('battleship-achievement-progress', JSON.stringify(progress));
  }, [progress]);

  const unlockAchievement = useCallback((achievementId: AchievementId) => {
    setAchievements((prev) => {
      const updated = prev.map((achievement) => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(),
          };

          // Dispatch custom event for toast notification immediately with correct data
          const event = new CustomEvent('achievement-unlocked', {
            detail: unlockedAchievement,
          });
          window.dispatchEvent(event);

          return unlockedAchievement;
        }
        return achievement;
      });
      return updated;
    });
  }, []);

  const checkAchievements = useCallback(
    (gameEvent: GameEvents, data?: any) => {
      setProgress((prev) => {
        const newProgress = { ...prev };

        // Update progress based on game event
        switch (gameEvent) {
          case GameEvents.USER_WIN:
            newProgress.totalWins++;
            newProgress.winStreak++;
            if (newProgress.winStreak > newProgress.bestWinStreak) {
              newProgress.bestWinStreak = newProgress.winStreak;
            }

            // Check for quick win
            if (data?.shots && data.shots <= 20) {
              newProgress.quickWins++;
            }

            // Check for perfect game
            if (data?.perfectGame) {
              newProgress.perfectGames++;
            }

            // Check for comeback win
            if (data?.comebackWin) {
              newProgress.gamesWithComeback++;
            }

            // Check difficulty
            if (data?.aiLevel === 'easy') {
              newProgress.winsOnEasy++;
            } else if (data?.aiLevel === 'medium') {
              newProgress.winsOnMedium++;
            } else if (data?.aiLevel === 'hard') {
              newProgress.winsOnHard++;
            }
            break;

          case GameEvents.USER_LOSE:
            newProgress.totalLosses++;
            newProgress.winStreak = 0;
            break;

          case GameEvents.USER_HIT:
            newProgress.totalHits++;
            newProgress.consecutiveHits++;
            if (newProgress.consecutiveHits > newProgress.bestConsecutiveHits) {
              newProgress.bestConsecutiveHits = newProgress.consecutiveHits;
            }

            // Check for first shot hit (only if this is the first shot of the current game)
            if (data?.currentGameShots === 1) {
              newProgress.firstShotHits++;
            }

            // Check for corner hits
            if (data?.position) {
              const [row, col] = data.position;
              if ((row === 0 || row === 9) && (col === 0 || col === 9)) {
                newProgress.cornerHits++;
              }
              // Check for center hits
              if (row >= 3 && row <= 6 && col >= 3 && col <= 6) {
                newProgress.centerHits++;
              }
              // Check for edge hits
              if (row === 0 || row === 9 || col === 0 || col === 9) {
                newProgress.edgeHits++;
              }
            }
            break;

          case GameEvents.USER_MISS:
            newProgress.totalMisses++;
            newProgress.consecutiveHits = 0;
            break;

          case GameEvents.GAME_START:
            // Track games played on different difficulties
            if (data?.aiLevel === 'easy') {
              newProgress.gamesOnEasy++;
            } else if (data?.aiLevel === 'medium') {
              newProgress.gamesOnMedium++;
            } else if (data?.aiLevel === 'hard') {
              newProgress.gamesOnHard++;
            }
            break;

          case GameEvents.SOUND_ENABLED:
            newProgress.soundEnabled++;
            break;

          case GameEvents.USER_SUNK_COMPUTER:
            newProgress.shipsSunk++;
            if (data?.shipName === 'carrier') {
              newProgress.carriersSunk++;
            }
            if (data?.shipName === 'destroyer') {
              newProgress.destroyersSunk++;
            }
            if (data?.shipName === 'submarine') {
              newProgress.submarinesSunk++;
            }
            if (data?.shipName === 'cruiser') {
              newProgress.cruisersSunk++;
            }
            if (data?.shipName === 'battleship') {
              newProgress.battleshipsSunk++;
            }

            break;
        }

        newProgress.totalShots = newProgress.totalHits + newProgress.totalMisses;
        newProgress.totalGames = newProgress.totalWins + newProgress.totalLosses;

        // Check for achievement unlocks using the updated progress
        achievements.forEach((achievement) => {
          if (achievement.unlocked) return;

          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first_win':
              shouldUnlock = newProgress.totalWins >= 1;
              break;
            case 'perfect_game':
              shouldUnlock = newProgress.perfectGames >= 1;
              break;
            case 'quick_win':
              shouldUnlock = newProgress.quickWins >= 1;
              break;
            case 'efficient_win':
              // Check if the game was won in 25 shots or less
              if (gameEvent === GameEvents.USER_WIN && data?.shots) {
                shouldUnlock = data.shots <= 25;
              }
              break;
            case 'sniper': {
              // Only check sniper achievement after completing a game
              if (gameEvent === GameEvents.USER_WIN || gameEvent === GameEvents.USER_LOSE) {
                const gameAccuracy = data?.hits && data?.shots ? data.hits / data.shots : 0;
                shouldUnlock = gameAccuracy >= 0.9;
              }
              break;
            }
            case 'destroyer_master':
              shouldUnlock = newProgress.destroyersSunk >= 10;
              break;
            case 'carrier_hunter':
              shouldUnlock = newProgress.carriersSunk >= 5;
              break;
            case 'corner_specialist':
              shouldUnlock = newProgress.cornerHits >= 20;
              break;
            case 'center_master':
              shouldUnlock = newProgress.centerHits >= 30;
              break;
            case 'win_streak_3':
              shouldUnlock = newProgress.bestWinStreak >= 3;
              break;
            case 'win_streak_5':
              shouldUnlock = newProgress.bestWinStreak >= 5;
              break;
            case 'win_streak_10':
              shouldUnlock = newProgress.bestWinStreak >= 10;
              break;
            case 'games_played_10':
              shouldUnlock = newProgress.totalGames >= 10;
              break;
            case 'games_played_50':
              shouldUnlock = newProgress.totalGames >= 50;
              break;
            case 'games_played_100':
              shouldUnlock = newProgress.totalGames >= 100;
              break;
            case 'hard_mode_master':
              shouldUnlock = newProgress.winsOnHard >= 10;
              break;
            case 'comeback_king':
              shouldUnlock = newProgress.gamesWithComeback >= 1;
              break;
            case 'lucky_guess':
              shouldUnlock = newProgress.bestConsecutiveHits >= 5;
              break;
            case 'battleship_legend': {
              const unlockedCount = achievements.filter((a) => a.unlocked).length;
              shouldUnlock = unlockedCount >= achievements.length - 1; // All except this one
              break;
            }
            case 'submarine_hunter':
              shouldUnlock = newProgress.submarinesSunk >= 1;
              break;
            case 'cruiser_slayer':
              shouldUnlock = newProgress.cruisersSunk >= 1;
              break;
            case 'battleship_destroyer':
              shouldUnlock = newProgress.battleshipsSunk >= 1;
              break;
            case 'easy_master':
              shouldUnlock = newProgress.winsOnEasy >= 1;
              break;
            case 'medium_master':
              shouldUnlock = newProgress.winsOnMedium >= 1;
              break;
            case 'hard_master':
              shouldUnlock = newProgress.winsOnHard >= 1;
              break;
            case 'submarine_expert':
              shouldUnlock = newProgress.submarinesSunk >= 5;
              break;
            case 'cruiser_expert':
              shouldUnlock = newProgress.cruisersSunk >= 5;
              break;
            case 'battleship_expert':
              shouldUnlock = newProgress.battleshipsSunk >= 5;
              break;
            case 'easy_expert':
              shouldUnlock = newProgress.winsOnEasy >= 5;
              break;
            case 'medium_expert':
              shouldUnlock = newProgress.winsOnMedium >= 5;
              break;
            case 'hard_expert':
              shouldUnlock = newProgress.winsOnHard >= 5;
              break;
            case 'first_shot_hit':
              shouldUnlock = newProgress.firstShotHits >= 1;
              break;
            case 'sound_on':
              shouldUnlock = newProgress.soundEnabled >= 1;
              break;
          }

          if (shouldUnlock) {
            unlockAchievement(achievement.id);
          }
        });

        return newProgress;
      });
    },
    [achievements, progress, unlockAchievement]
  );

  const resetProgress = useCallback(() => {
    setProgress({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winStreak: 0,
      bestWinStreak: 0,
      gamesOnHard: 0,
      winsOnHard: 0,
      perfectGames: 0,
      quickWins: 0,
      totalHits: 0,
      totalMisses: 0,
      totalShots: 0,
      shipsSunk: 0,
      carriersSunk: 0,
      destroyersSunk: 0,
      submarinesSunk: 0,
      cruisersSunk: 0,
      battleshipsSunk: 0,
      cornerHits: 0,
      centerHits: 0,
      edgeHits: 0,
      consecutiveHits: 0,
      bestConsecutiveHits: 0,
      gamesWithComeback: 0,
      gamesOnEasy: 0,
      winsOnEasy: 0,
      gamesOnMedium: 0,
      winsOnMedium: 0,
      firstShotHits: 0,
      soundEnabled: 0,
    });
    setAchievements(createAchievements());
  }, []);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        progress,
        unlockedAchievements,
        checkAchievements,
        resetProgress,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
