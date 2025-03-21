import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { checkAllShipsSunk, declareWinner, isShipSunk } from './helpers';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog, heatMapSimulations } = useContext(GameContext);

  return useCallback(() => {
    const heatMap = calculateHeatMap(userShips);
    const flatHeatMap = heatMap.flat();

    console.log(flatHeatMap);

    let maxValue = -1;
    let maxValueIndex = 0;

    flatHeatMap.forEach((value, index) => {
      if (value !== heatMapSimulations && value > maxValue) {
        maxValue = value;
        maxValueIndex = index;
      }
    });

    // Create a list of all cells that have the most heat, and pick one at random
    const maxValueIndices = flatHeatMap.reduce((indices: number[], value: number, index: number) => {
      if (value === maxValue) {
        indices.push(index);
      }
      return indices;
    }, []);
    maxValueIndex = maxValueIndices[Math.floor(Math.random() * maxValueIndices.length)];

    const y = Math.floor(maxValueIndex / 10);
    const x = maxValueIndex % 10;

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
      addToLog(`Computer guessed ${letters[y]}${x + 1}, ${status}`);

      if (isShipSunk(cell?.name as ShipNames, newUserShips)) {
        addToLog(`Computer sunk ${cell?.name}`);

        if (checkAllShipsSunk(newUserShips)) {
          addToLog(declareWinner('computer'));
        }
      }
    }
    // }
  }, [userShips, setUserShips, addToLog, heatMapSimulations]);
};
