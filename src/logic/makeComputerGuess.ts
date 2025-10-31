import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames, PositionArray, AiLevel } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { checkAllShipsSunk, isShipSunk } from './helpers';
import { deriveAvatarName, GameEvents } from '../components/Avatar';
import { playAlarmSound, playFailSound, playLoseSound, fadeOutMusic } from '../utils/soundEffects';
import { useAchievementTracker } from '../hooks/useAchievementTracker';

const deriveIntelligence = (aiLevel: AiLevel) => {
  return {
    biasGuessesTowardsCenter: aiLevel === 'hard' ? true : false,
    willGuessAdjacentToSunkShips: aiLevel === 'easy' ? true : false,
    chooseBetweenNumberOfCells: () => {
      switch (aiLevel) {
        case 'easy':
          return 4;
        case 'medium':
          return 3;
        case 'hard':
          return Math.ceil(Math.random() * 3); // 1, 2, or 3
      }
    },
  };
};

// Helper function to check if a cell is adjacent to hits based on ship sunk status
const isAdjacentToHit = (board: PositionArray, x: number, y: number, isSunk: boolean): boolean => {
  // Check all 4 adjacent cells
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 }, // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }, // right
  ];

  for (const { dx, dy } of directions) {
    const newX = x + dx;
    const newY = y + dy;

    // Check bounds
    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
      const adjacentCell = board[newY][newX];
      if (
        adjacentCell?.status === CellStates.hit &&
        adjacentCell?.name &&
        isShipSunk(adjacentCell.name as ShipNames, board) === isSunk
      ) {
        return true;
      }
    }
  }

  return false;
};

// Convenience functions for specific use cases
const isAdjacentToUnsunkHit = (board: PositionArray, x: number, y: number): boolean =>
  isAdjacentToHit(board, x, y, false);

const isAdjacentToSunkShip = (board: PositionArray, x: number, y: number): boolean =>
  isAdjacentToHit(board, x, y, true);

// Helper function to check if a cell would continue a line of hits
const wouldContinueHitLine = (board: PositionArray, x: number, y: number): boolean => {
  // Check horizontal line continuation
  // Count consecutive hits to the left
  let leftHits = 0;
  for (let i = x - 1; i >= 0; i--) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      leftHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Count consecutive hits to the right
  let rightHits = 0;
  for (let i = x + 1; i < 10; i++) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      rightHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Check if this cell would continue a horizontal line (at least 2 consecutive hits on one side)
  if (leftHits >= 2 || rightHits >= 2) {
    return true;
  }

  // Check for gap-filling pattern: HIT-[target]-HIT
  // Look for hits on both sides with unguessed cells in between
  let leftHitFound = false;
  let rightHitFound = false;

  // Check left side for a hit
  for (let i = x - 1; i >= 0; i--) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      leftHitFound = true;
      break;
    } else if (cell?.status === CellStates.miss || cell?.status === CellStates.unguessed) {
      break; // Stop at first non-hit that's not unguessed
    }
  }

  // Check right side for a hit
  for (let i = x + 1; i < 10; i++) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      rightHitFound = true;
      break;
    } else if (cell?.status === CellStates.miss || cell?.status === CellStates.unguessed) {
      break; // Stop at first non-hit that's not unguessed
    }
  }

  // If we have hits on both sides, this is a gap-filling opportunity
  if (leftHitFound && rightHitFound) {
    return true;
  }

  // Check vertical line continuation
  // Count consecutive hits above
  let aboveHits = 0;
  for (let i = y - 1; i >= 0; i--) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      aboveHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Count consecutive hits below
  let belowHits = 0;
  for (let i = y + 1; i < 10; i++) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      belowHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Check if this cell would continue a vertical line (at least 2 consecutive hits on one side)
  if (aboveHits >= 2 || belowHits >= 2) {
    return true;
  }

  // Check for vertical gap-filling pattern: HIT-[target]-HIT
  let aboveHitFound = false;
  let belowHitFound = false;

  // Check above for a hit
  for (let i = y - 1; i >= 0; i--) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      aboveHitFound = true;
      break;
    } else if (cell?.status === CellStates.miss || cell?.status === CellStates.unguessed) {
      break; // Stop at first non-hit that's not unguessed
    }
  }

  // Check below for a hit
  for (let i = y + 1; i < 10; i++) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      belowHitFound = true;
      break;
    } else if (cell?.status === CellStates.miss || cell?.status === CellStates.unguessed) {
      break; // Stop at first non-hit that's not unguessed
    }
  }

  // If we have hits on both sides vertically, this is a gap-filling opportunity
  if (aboveHitFound && belowHitFound) {
    return true;
  }

  return false;
};

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus } = useContext(GameContext);
  const { trackGameEvent } = useAchievementTracker();
  const isGuessing = React.useRef(false);

  return useCallback(() => {
    if (isGuessing.current || gameStatus !== 'computer-turn') {
      return;
    }

    isGuessing.current = true;

    // First, check for cells that would continue a line of hits (highest priority)
    const lineContinuationCells: number[] = [];
    // Second, check for cells adjacent to unsunk hits (second priority)
    const adjacentToUnsunkHits: number[] = [];

    for (let i = 0; i < 100; i++) {
      const y = Math.floor(i / 10);
      const x = i % 10;
      const cell = userShips[y][x];

      if (!deriveIntelligence(aiLevel).willGuessAdjacentToSunkShips) {
        // Only consider unguessed cells that are not adjacent to sunk ships
        if ((cell?.status === CellStates.unguessed || !cell) && !isAdjacentToSunkShip(userShips, x, y)) {
          // Check if this cell would continue a line of hits (highest priority)
          if (wouldContinueHitLine(userShips, x, y)) {
            lineContinuationCells.push(i);
          }
          // Check if this cell is adjacent to any unsunk hit (second priority)
          else if (isAdjacentToUnsunkHit(userShips, x, y)) {
            adjacentToUnsunkHits.push(i);
          }
        }
      }
    }

    let targetIndex: number;

    if (lineContinuationCells.length > 0) {
      // For line continuation, pick the cell with highest heat value
      // If multiple cells have the same heat, pick the one closest to center (hard mode only)
      const heatMap = calculateHeatMap(userShips, aiLevel);
      const centerX = 4.5;
      const centerY = 4.5;

      // Calculate heat values for all line continuation cells
      const cellsWithHeat = lineContinuationCells.map((index) => {
        const y = Math.floor(index / 10);
        const x = index % 10;
        return { index, heat: heatMap[y][x] };
      });

      // Sort by heat value (highest first)
      cellsWithHeat.sort((a, b) => b.heat - a.heat);

      if (aiLevel === 'hard' && cellsWithHeat.length > 1) {
        // Hard mode: pick from top 2 cells with weighted probability (70% top, 30% second)
        const top2Cells = cellsWithHeat.slice(0, 2);
        if (top2Cells[0].heat === top2Cells[1].heat && deriveIntelligence(aiLevel).biasGuessesTowardsCenter) {
          // If tied, prefer center
          const tied = top2Cells;
          let closestToCenter = tied[0].index;
          let minDistance = Infinity;
          for (const cell of tied) {
            const y = Math.floor(cell.index / 10);
            const x = cell.index % 10;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            if (distance < minDistance) {
              minDistance = distance;
              closestToCenter = cell.index;
            }
          }
          targetIndex = closestToCenter;
        } else {
          // Weighted random: 70% chance top, 30% chance second
          targetIndex = Math.random() < 0.7 ? top2Cells[0].index : top2Cells[1].index;
        }
      } else {
        // Easy/Medium or single option: pick highest
        let bestHeat = cellsWithHeat[0].heat;
        const tiedCells: number[] = [];

        for (const { index, heat } of cellsWithHeat) {
          if (heat === bestHeat) {
            tiedCells.push(index);
          } else {
            break; // Sorted, so we can stop here
          }
        }

        // If there are ties, pick based on intelligence
        if (tiedCells.length > 1) {
          if (deriveIntelligence(aiLevel).biasGuessesTowardsCenter) {
            let closestToCenter = tiedCells[0];
            let minDistance = Infinity;

            for (const index of tiedCells) {
              const y = Math.floor(index / 10);
              const x = index % 10;
              const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
              if (distance < minDistance) {
                minDistance = distance;
                closestToCenter = index;
              }
            }
            targetIndex = closestToCenter;
          } else {
            // Random selection among ties
            targetIndex = tiedCells[Math.floor(Math.random() * tiedCells.length)];
          }
        } else {
          targetIndex = tiedCells[0];
        }
      }
    } else if (adjacentToUnsunkHits.length > 0) {
      // Second priority: cells adjacent to unsunk hits
      targetIndex = adjacentToUnsunkHits[Math.floor(Math.random() * adjacentToUnsunkHits.length)];
    } else {
      // Fall back to heat map system
      const heatMap = calculateHeatMap(userShips, aiLevel);
      const flatHeatMap = heatMap.flat();
      // Find the top 2 highest values
      const sortedValues = [...flatHeatMap].sort((a, b) => b - a);

      let numOfChoices;
      switch (aiLevel) {
        case 'easy':
          numOfChoices = 4;
          break;
        case 'medium':
          numOfChoices = 3;
          break;
        case 'hard':
          numOfChoices = 2; // Use top 2 to add some unpredictability
          break;
        default:
          numOfChoices = 2;
          break;
      }
      const topValues = [...new Set(sortedValues)].slice(0, numOfChoices);

      // Get all indices that match any of the top 3 values

      // Note: maxValue and maxValueIndex were used in previous logic but are now unused
      // Keeping the heat map calculation for potential future use

      // Create a list of all cells that have the most heat, filtering out already guessed cells and cells adjacent to sunk ships
      const maxValueIndices = flatHeatMap.reduce((indices: number[], value: number, index: number) => {
        if (topValues.includes(value)) {
          const y = Math.floor(index / 10);
          const x = index % 10;
          const cell = userShips[y][x];
          // Only include unguessed cells that are not adjacent to sunk ships
          if ((cell?.status === CellStates.unguessed || !cell) && !isAdjacentToSunkShip(userShips, x, y)) {
            indices.push(index);
          }
        }
        return indices;
      }, []);

      // If no valid cells found in top 2 values, fall back to any unguessed cell
      let validIndices = maxValueIndices;
      if (validIndices.length === 0) {
        validIndices = flatHeatMap.reduce((indices: number[], value: number, index: number) => {
          const y = Math.floor(index / 10);
          const x = index % 10;
          const cell = userShips[y][x];
          if (cell?.status === CellStates.unguessed || !cell) {
            indices.push(index);
          }
          return indices;
        }, []);
      }

      // If we have cells from heat map but they're all adjacent to sunk ships,
      // prefer cells that are NOT adjacent to sunk ships
      if (validIndices.length > 1) {
        const nonAdjacentToSunkShips = validIndices.filter((index) => {
          const y = Math.floor(index / 10);
          const x = index % 10;
          return !isAdjacentToSunkShip(userShips, x, y);
        });

        // Only use the sunk ship filter if we have other good options
        if (nonAdjacentToSunkShips.length > 0) {
          validIndices = nonAdjacentToSunkShips;
        }
      }

      if (validIndices.length === 0) {
        isGuessing.current = false;
        return;
      }

      targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    }

    const y = Math.floor(targetIndex / 10);
    const x = targetIndex % 10;

    const cell = userShips[y][x];
    // This should always be an unguessed cell now
    if (cell?.status === CellStates.unguessed || !cell) {
      const newUserShips = [...userShips.map((row) => [...row])];

      const status = cell?.name ? CellStates.hit : CellStates.miss;

      newUserShips[y][x] = {
        name: cell?.name || null,
        status,
      };

      setUserShips(newUserShips);
      addToLog(
        `${deriveAvatarName(aiLevel)} fired at ${letters[y]}${x + 1} - ${status === CellStates.hit ? 'hit!' : 'miss'}`,
        status
      );

      if (status === CellStates.hit) {
        setAvatar({ gameEvent: GameEvents.COMPUTER_HIT });
      } else {
        setAvatar({ gameEvent: GameEvents.COMPUTER_MISS });
      }

      // If we've sunk a user's ship...
      if (status === CellStates.hit && cell?.name && isShipSunk(cell.name as ShipNames, newUserShips)) {
        // Play fail sound effect when computer sinks user's ship (no alarm sound)
        playFailSound();
        addToLog(`${deriveAvatarName(aiLevel)} sunk your ${cell.name}!`, 'sunk');
        setAvatar({ gameEvent: GameEvents.COMPUTER_SUNK_USER });

        let didWin = false;
        if (checkAllShipsSunk(newUserShips)) {
          // Fade out background music and play lose sound
          fadeOutMusic();
          playLoseSound();
          setgameStatus('computer-win');
          setAvatar({ gameEvent: GameEvents.COMPUTER_WIN });
          trackGameEvent(GameEvents.USER_LOSE, { aiLevel });
          didWin = true;
        }

        // Advance turn only if the game didn't end on this guess
        if (!didWin) {
          setgameStatus('user-turn');
        }
      } else {
        // If it was a miss, advance turn
        setgameStatus('user-turn');
      }

      // Play alarm sound for non-sinking hits
      if (status === CellStates.hit && !isShipSunk(cell?.name as ShipNames, newUserShips)) {
        playAlarmSound();
      }
    }

    isGuessing.current = false;
  }, [userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus]);
};
