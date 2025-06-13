import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';

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

  return (
    <div className="game-container">
      <div className="player-guess-board">
        <h3>User guess board</h3>
        <UserGuessBoard />
      </div>

      <div className="computer-avatar window">
        <h3>Computer avatar</h3>
      </div>

      <div className="stats window">
        <h3>Stats</h3>
      </div>

      <div className="player-fleet window">
        <h3>Player fleet</h3>
        <Board positions={userShips} />
      </div>

      <div className="feed window">
        <h3>Feed</h3>
        <Log />
      </div>

      {/* <h3>Computer board</h3>
      <Board positions={computerShips} /> */}
      {/* <h3>Heat map</h3> */}
      {/* <HeatMapBoard positions={calculateHeatMap(userShips, aiLevel)} /> */}
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <GameBoards />
      {/* <AiSlider /> */}
    </GameProvider>
  );
}

export default App;
