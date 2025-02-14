import React, { useContext, useCallback } from 'react';
import { GameContext } from '../GameContext';
import { CellStates } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { ai } from '../ai-behaviour';

export const useMakeComputerGuess = () => {
  const { userShips, setUserShips } = useContext(GameContext);

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

    console.log('Computer making guess', 'y', y, 'x', x);

    const cell = userShips[y][x];
    if (cell?.status === CellStates.unguessed || !cell) {
      const newUserShips = [...userShips.map((row) => [...row])];
      newUserShips[y][x] = {
        name: cell?.name || null,
        status: cell?.name ? CellStates.hit : CellStates.miss,
      };
      setUserShips(newUserShips);
    }
  }, [userShips, setUserShips]);
};
