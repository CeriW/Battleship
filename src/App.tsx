import React from 'react';
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
  const { userShips, computerShips, setUserShips, setComputerShips, playerTurn, setPlayerTurn } =
    React.useContext(GameContext);

  // const handleUserGuess = (row: number, col: number) => {
  //   const newUserShips = [...userShips];
  //   newUserShips[row][col] = { name: null, status: CellStates.hit };
  //   setUserShips(newUserShips);
  //   setTurn('computer');
  // };

  const makeComputerGuess = React.useCallback(() => {
    const heatMap = calculateHeatMap(userShips);
    const maxValue = Math.max(...heatMap.flat());

    console.log('heatMap', heatMap);

    const maxValueIndex = heatMap.flat().indexOf(maxValue);
    const y = Math.floor(maxValueIndex / 10);
    const x = maxValueIndex % 10;

    console.log('Computer making guess', 'y', y, 'x', x);

    // There's a ship here and we haven't guessed it yet
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

    // console.log(userShips);
  }, [userShips, setUserShips]);

  React.useEffect(() => {
    if (playerTurn === 'computer') {
      makeComputerGuess();
      setPlayerTurn('user');
    }
  }, [playerTurn, makeComputerGuess]);

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
