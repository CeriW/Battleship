import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { ai } from '../ai-behaviour';
import { isShipSunk } from './helpers';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips, addToLog } = useContext(GameContext);

  return useCallback(() => {
    const heatMap = calculateHeatMap(userShips);
    const flatHeatMap = heatMap.flat();

    let maxValue = -1;
    let maxValueIndex = -1;

    flatHeatMap.forEach((value, index) => {
      if (value !== ai.heatMapSimulations && value > maxValue) {
        maxValue = value;
        maxValueIndex = index;
      }
    });

    const y = Math.floor(maxValueIndex / 10);
    const x = maxValueIndex % 10;

    const cell = userShips[y][x];
    // If this is an unguessed or empty cell
    if (cell?.status === CellStates.unguessed || !cell) {
      const newUserShips = [...userShips.map((row) => [...row])];

      let sunk = false;
      const status = cell?.name ? CellStates.hit : CellStates.miss;

      newUserShips[y][x] = {
        name: cell?.name || null,
        status,
        sunk,
      };

      if (cell?.name) {
        // If there is a ship here, check whether it is now fully sunk
        sunk = isShipSunk(cell.name as ShipNames, newUserShips);
      }

      setUserShips(newUserShips);
      addToLog(`Computer guessed ${letters[y]}${x + 1}, ${status}`);
      if (sunk) {
        addToLog(`Computer sunk ${cell?.name}`);
      }
    }
  }, [userShips, setUserShips, addToLog]);
};
