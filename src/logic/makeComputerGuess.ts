import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { calculateHeatMap, HeatValues } from './calculateHeatMap';
import { checkAllShipsSunk, declareWinner, isShipSunk } from './helpers';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog, aiLevel, computerAvatar, setComputerAvatar, setPlayerTurn } =
    useContext(GameContext);

  // setComputerAvatar({ name: computerAvatar.name, emotion: 'thinking' });

  return useCallback(() => {
    setComputerAvatar({ name: computerAvatar.name, emotion: 'thinking' });

    // Add a delay to make it seem like the computer is thinking
    setTimeout(() => {
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
        addToLog(`Computer guessed ${letters[y]}${x + 1}, ${status}`, status);

        if (status === CellStates.hit) {
          setComputerAvatar({ name: computerAvatar.name, emotion: 'happy' });
        }

        setComputerAvatar({ name: computerAvatar.name, emotion: status === CellStates.hit ? 'happy' : 'confused' });

        if (isShipSunk(cell?.name as ShipNames, newUserShips)) {
          addToLog(`Computer sunk ${cell?.name}`, 'sunk');
          setComputerAvatar({ name: computerAvatar.name, emotion: 'happy' });

          if (checkAllShipsSunk(newUserShips)) {
            addToLog(declareWinner('computer'), 'computer-win');
          }
        }
      }

      setPlayerTurn('user');
    }, 1000);
  }, [userShips, setUserShips, addToLog, aiLevel, computerAvatar, setComputerAvatar, setPlayerTurn]);
};
