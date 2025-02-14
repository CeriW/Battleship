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

    if (userShips[y][x]?.status === CellStates.unguessed) {
      const newUserShips = [...userShips];
      newUserShips[y][x] = { name: userShips[y][x]?.name || null, status: CellStates.hit };
      setUserShips(newUserShips);
    }

    if (!userShips[y][x]) {
      const newUserShips = [...userShips];
      newUserShips[y][x] = { name: null, status: CellStates.miss };
      setUserShips(newUserShips);
    }
  }, [userShips, setUserShips]);
};
