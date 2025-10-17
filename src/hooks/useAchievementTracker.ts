import { useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { GameEvents } from '../components/Avatar';

interface GameStats {
  shots: number;
  hits: number;
  misses: number;
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
  startTime: number;
  aiLevel: string;
  userShipsLost: number;
}

export const useAchievementTracker = () => {
  const { checkAchievements } = useAchievements();
  const gameStatsRef = useRef<GameStats>({
    shots: 0,
    hits: 0,
    misses: 0,
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
    startTime: Date.now(),
    aiLevel: 'hard',
    userShipsLost: 0,
  });

  const resetGameStats = () => {
    gameStatsRef.current = {
      shots: 0,
      hits: 0,
      misses: 0,
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
      startTime: Date.now(),
      aiLevel: gameStatsRef.current.aiLevel,
      userShipsLost: 0,
    };
  };

  const trackGameEvent = (gameEvent: GameEvents, data?: any) => {
    const stats = gameStatsRef.current;

    switch (gameEvent) {
      case GameEvents.USER_HIT:
        stats.hits++;
        stats.shots++;
        stats.consecutiveHits++;

        if (stats.consecutiveHits > stats.bestConsecutiveHits) {
          stats.bestConsecutiveHits = stats.consecutiveHits;
        }

        // Track position-based hits
        if (data?.position) {
          const [row, col] = data.position;

          // Corner hits (A1, A10, J1, J10)
          if ((row === 0 || row === 9) && (col === 0 || col === 9)) {
            stats.cornerHits++;
          }

          // Center hits (D4-D7, E4-E7)
          if (row >= 3 && row <= 6 && col >= 3 && col <= 6) {
            stats.centerHits++;
          }

          // Edge hits (any edge position)
          if (row === 0 || row === 9 || col === 0 || col === 9) {
            stats.edgeHits++;
          }
        }

        checkAchievements(gameEvent, {
          position: data?.position,
          consecutiveHits: stats.consecutiveHits,
          currentGameShots: stats.shots,
        });
        break;

      case GameEvents.USER_MISS:
        stats.misses++;
        stats.shots++;
        stats.consecutiveHits = 0;
        checkAchievements(gameEvent);
        break;

      case GameEvents.USER_SUNK_COMPUTER:
        stats.shipsSunk++;

        if (data?.shipName === 'carrier') {
          stats.carriersSunk++;
        }
        if (data?.shipName === 'destroyer') {
          stats.destroyersSunk++;
        }
        if (data?.shipName === 'submarine') {
          stats.submarinesSunk++;
        }
        if (data?.shipName === 'cruiser') {
          stats.cruisersSunk++;
        }
        if (data?.shipName === 'battleship') {
          stats.battleshipsSunk++;
        }

        checkAchievements(gameEvent, {
          shipName: data?.shipName,
          shipsSunk: stats.shipsSunk,
          carriersSunk: stats.carriersSunk,
          destroyersSunk: stats.destroyersSunk,
          submarinesSunk: stats.submarinesSunk,
          cruisersSunk: stats.cruisersSunk,
          battleshipsSunk: stats.battleshipsSunk,
        });
        break;

      case GameEvents.COMPUTER_SUNK_USER:
        stats.userShipsLost++;
        checkAchievements(gameEvent, {
          userShipsLost: stats.userShipsLost,
        });
        break;

      case GameEvents.USER_WIN: {
        const timeToWin = Date.now() - stats.startTime;
        const perfectGame = stats.misses === 0;
        const quickWin = stats.shots <= 20;
        const noMissGame = stats.misses === 0;
        const comebackWin = stats.userShipsLost >= 3;

        checkAchievements(gameEvent, {
          shots: stats.shots,
          hits: stats.hits,
          misses: stats.misses,
          timeToWin,
          perfectGame,
          quickWin,
          noMissGame,
          comebackWin,
          playerShipsLost: stats.userShipsLost,
          shipsSunk: stats.shipsSunk,
          aiLevel: stats.aiLevel,
        });

        // Reset for next game
        resetGameStats();
        break;
      }

      case GameEvents.USER_LOSE: {
        checkAchievements(gameEvent, {
          shots: stats.shots,
          hits: stats.hits,
          misses: stats.misses,
          aiLevel: stats.aiLevel,
        });

        // Reset for next game
        resetGameStats();
        break;
      }

      case GameEvents.GAME_START:
        stats.aiLevel = data?.aiLevel || 'hard';
        resetGameStats();
        checkAchievements(gameEvent, { aiLevel: stats.aiLevel });
        break;

      case GameEvents.SOUND_ENABLED:
        // No stats to track for sound enabled, just pass the event
        checkAchievements(gameEvent);
        break;
    }
  };

  const updateAiLevel = (aiLevel: string) => {
    gameStatsRef.current.aiLevel = aiLevel;
  };

  return {
    trackGameEvent,
    updateAiLevel,
    getCurrentStats: () => ({ ...gameStatsRef.current }),
  };
};
