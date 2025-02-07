import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
import { calculateHeatMap } from './logic/calculateHeatMap';
import UserGuessBoard from './components/UserGuessBoard';

export const shipTypes: ShipInfo[] = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

const GameBoards = () => {
  const { userShips, computerShips, setUserShips, playerTurn, setPlayerTurn } = useContext(GameContext);

  const makeComputerGuess = React.useCallback(() => {
    const heatMap = calculateHeatMap(userShips);
    const flatHeatMap = heatMap.flat();

    // Find the highest value that isn't ai.heatMapSimulations
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

    // There's a ship here and we haven't guessed it yet
    if (userShips[y][x]?.status === CellStates.unguessed) {
      const newUserShips = [...userShips];
      newUserShips[y][x] = { name: userShips[y][x]?.name || null, status: CellStates.hit };
      setUserShips(newUserShips);
    }

    // If there's no ship here, we've missed
    if (!userShips[y][x]) {
      const newUserShips = [...userShips];
      newUserShips[y][x] = { name: null, status: CellStates.miss };
      setUserShips(newUserShips);
    }
  }, [userShips, setUserShips]);

  useEffect(() => {
    if (playerTurn === 'computer') {
      makeComputerGuess();
      setPlayerTurn('user');
    }
  }, [playerTurn, makeComputerGuess, setPlayerTurn]);

  return (
    <div id="boards">
      <h3>User guess board</h3>
      <UserGuessBoard />

      <h3>User board</h3>
      <Board positions={userShips} />

      <h3>Computer board</h3>
      <Board positions={computerShips} />
      <h3>Heat map</h3>
      <HeatMapBoard positions={calculateHeatMap(userShips)} />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <GameBoards />
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
    </GameProvider>
  );
}

export default App;
