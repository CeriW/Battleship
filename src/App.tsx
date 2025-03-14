import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';

import { ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';
import { useMakeComputerGuess } from './logic/makeComputerGuess';

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
  const { userShips, computerShips, playerTurn, setPlayerTurn, gameEnded, addToLog, aiLevel } = useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();

  useEffect(() => {
    if (!gameEnded) {
      addToLog(`${playerTurn} turn`);
    }
  }, [playerTurn]);

  useEffect(() => {
    if (playerTurn === 'computer' && !gameEnded) {
      makeComputerGuess();
      setPlayerTurn('user');
    }
  }, [playerTurn]);

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
  const { aiLevel } = useContext(GameContext);

  return (
    <GameProvider>
      <GameBoards />
      <Log />
      <div>Difficulty: {aiLevel}</div>
    </GameProvider>
  );
}

export default App;
