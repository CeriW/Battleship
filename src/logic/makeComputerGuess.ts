import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames, PositionArray } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { checkAllShipsSunk, isShipSunk } from './helpers';
import { deriveAvatarName, GameEvents } from '../components/Avatar';

// Helper function to check if a cell is adjacent to an unsunk hit
const isAdjacentToUnsunkHit = (board: PositionArray, x: number, y: number): boolean => {
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
        !isShipSunk(adjacentCell.name as ShipNames, board)
      ) {
        return true;
      }
    }
  }

  return false;
};

// Helper function to check if a cell would continue a line of hits
const wouldContinueHitLine = (board: PositionArray, x: number, y: number): boolean => {
  // Check horizontal line continuation
  let horizontalHits = 0;

  // Count consecutive hits to the left
  for (let i = x - 1; i >= 0; i--) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      horizontalHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Count consecutive hits to the right
  for (let i = x + 1; i < 10; i++) {
    const cell = board[y][i];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      horizontalHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // If we have 2 or more hits in a horizontal line, this cell would continue it
  if (horizontalHits >= 2) {
    return true;
  }

  // Check vertical line continuation
  let verticalHits = 0;

  // Count consecutive hits above
  for (let i = y - 1; i >= 0; i--) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      verticalHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // Count consecutive hits below
  for (let i = y + 1; i < 10; i++) {
    const cell = board[i][x];
    if (cell?.status === CellStates.hit && cell?.name && !isShipSunk(cell.name as ShipNames, board)) {
      verticalHits++;
    } else {
      break; // Stop at first non-hit
    }
  }

  // If we have 2 or more hits in a vertical line, this cell would continue it
  if (verticalHits >= 2) {
    return true;
  }

  return false;
};

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus } = useContext(GameContext);
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

      // Only consider unguessed cells
      if (cell?.status === CellStates.unguessed || !cell) {
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

    let targetIndex: number;

    if (lineContinuationCells.length > 0) {
      // Prioritize cells that would continue a line of hits
      targetIndex = lineContinuationCells[Math.floor(Math.random() * lineContinuationCells.length)];
    } else if (adjacentToUnsunkHits.length > 0) {
      // Second priority: cells adjacent to unsunk hits
      targetIndex = adjacentToUnsunkHits[Math.floor(Math.random() * adjacentToUnsunkHits.length)];
    } else {
      // Fall back to heat map system
      const heatMap = calculateHeatMap(userShips, aiLevel);
      const flatHeatMap = heatMap.flat();
      // Find the top 2 highest values
      const sortedValues = [...flatHeatMap].sort((a, b) => b - a);
      const top2Values = [...new Set(sortedValues)].slice(0, 2);

      // Get all indices that match any of the top 3 values

      // Note: maxValue and maxValueIndex were used in previous logic but are now unused
      // Keeping the heat map calculation for potential future use

      // Create a list of all cells that have the most heat, filtering out already guessed cells
      const maxValueIndices = flatHeatMap.reduce((indices: number[], value: number, index: number) => {
        if (top2Values.includes(value)) {
          const y = Math.floor(index / 10);
          const x = index % 10;
          const cell = userShips[y][x];
          // Only include unguessed cells
          if (cell?.status === CellStates.unguessed || !cell) {
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
      addToLog(`${deriveAvatarName(aiLevel)} guessed ${letters[y]}${x + 1}, ${status}`, status);

      if (status === CellStates.hit) {
        setAvatar({ gameEvent: GameEvents.COMPUTER_HIT });
      } else {
        setAvatar({ gameEvent: GameEvents.COMPUTER_MISS });
      }

      // If we've sunk a user's ship...
      if (isShipSunk(cell?.name as ShipNames, newUserShips)) {
        addToLog(`${deriveAvatarName(aiLevel)} sunk ${cell?.name}`, 'sunk');
        setAvatar({ gameEvent: GameEvents.COMPUTER_SUNK_USER });

        let didWin = false;
        if (checkAllShipsSunk(newUserShips)) {
          setgameStatus('computer-win');
          setAvatar({ gameEvent: GameEvents.COMPUTER_WIN });
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
    }

    isGuessing.current = false;
  }, [userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus]);
};
