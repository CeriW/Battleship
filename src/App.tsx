import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.css';

import { CellStates, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';
import { useMakeComputerGuess } from './logic/makeComputerGuess';

import { calculateHeatMap } from './logic/calculateHeatMap';
import UserGuessBoard from './components/UserGuessBoard';
import { Log } from './components/Log';
import AiSlider from './components/AiChooser';

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

  // userShips[5][5] = {
  //   name: 'carrier',
  //   status: CellStates.hit,
  // };
  // userShips[5][6] = {
  //   name: 'carrier',
  //   status: CellStates.hit,
  // };

  // for (let i = 0; i < 10; i++) {
  //   for (let j = 0; j < 10; j++) {
  //     if (userShips[i][j]?.name === 'carrier') {
  //       userShips[i][j]!.status = CellStates.hit;
  //       i = 100;
  //       j = 100;
  //     }
  //   }
  // }

  return (
    <div id="boards">
      <h3>User guess board</h3>
      <UserGuessBoard />

      <h3>User board</h3>
      <Board positions={userShips} />

      <h3>Computer board</h3>
      <Board positions={computerShips} />
      <h3>Heat map</h3>
      <HeatMapBoard positions={calculateHeatMap(userShips, aiLevel)} />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <div className="container">
        <h1>Battleship Game</h1>
        <GameBoards />
        <div>
          <Log />
          <AiSlider />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
