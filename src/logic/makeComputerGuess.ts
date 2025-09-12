import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { checkAllShipsSunk, isShipSunk } from './helpers';
import { deriveAvatarName, GameEvents } from '../components/Avatar';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus } = useContext(GameContext);
  const isGuessing = React.useRef(false);

  return useCallback(() => {
    if (isGuessing.current || gameStatus !== 'computer-turn') {
      return;
    }

    isGuessing.current = true;

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

    // Pick a random index from valid cells
    const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    const y = Math.floor(randomIndex / 10);
    const x = randomIndex % 10;

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
