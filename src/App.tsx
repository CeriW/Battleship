import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';
import Window from './components/Window';

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
      // addToLog(`${playerTurn} turn`, 'general');
      // TODO - there will be a UI element for this
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
        {/* <h3>User guess board</h3> */}
        <div className="player-guess-board-inner">
          <UserGuessBoard />
        </div>
      </div>

      <Window title="Computer avatar" className="computer-avatar">
        <div>Computer's avatar will appear here</div>
      </Window>

      <Window title="Stats" className="stats">
        <div>Stats will appear here</div>
      </Window>

      <Window title="Player fleet" className="player-fleet">
        <Board positions={userShips} icons="light" />
      </Window>

      <Window title="Feed" className="feed">
        <Log />
      </Window>

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
