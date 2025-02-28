import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';
import { useMakeComputerGuess } from './logic/makeComputerGuess';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
import { calculateHeatMap } from './logic/calculateHeatMap';
import UserGuessBoard from './components/UserGuessBoard';
import { Log } from './components/Log';

export const shipTypes: ShipInfo[] = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

const GameBoards = () => {
  const { userShips, computerShips, playerTurn, setPlayerTurn } = useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();

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
      <Log />
    </GameProvider>
  );
}

export default App;
