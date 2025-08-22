import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { calculateHeatMap, HeatValues } from './calculateHeatMap';
import { checkAllShipsSunk, isShipSunk } from './helpers';
import { deriveAvatarEmotion, deriveAvatarName, GameEvents } from '../components/Avatar';
import { declareWinner } from './GameEndScreen';

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

    let maxValue = -1;
    let maxValueIndex = 0;

    flatHeatMap.forEach((value, index) => {
      if (value !== HeatValues.hit && value > maxValue) {
        maxValue = value;
        maxValueIndex = index;
      }
    });

    // Create a list of all cells that have the most heat, and pick one at random
    const maxValueIndices = flatHeatMap.reduce((indices: number[], value: number, index: number) => {
      if (top2Values.includes(value)) {
        indices.push(index);
      }
      return indices;
    }, []);

    // Pick a random index from the top 3 values
    const randomIndex = maxValueIndices[Math.floor(Math.random() * maxValueIndices.length)];
    const y = Math.floor(randomIndex / 10);
    const x = randomIndex % 10;

    const cell = userShips[y][x];
    // If this is an unguessed or empty cell
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

        if (checkAllShipsSunk(newUserShips)) {
          addToLog(declareWinner('computer'), 'computer-win');
          setgameStatus('computer-win');
          setAvatar({ gameEvent: GameEvents.COMPUTER_WIN });
        }
      }
    }

    isGuessing.current = false;
  }, [userShips, setUserShips, addToLog, aiLevel, setAvatar, setgameStatus, gameStatus]);
};
