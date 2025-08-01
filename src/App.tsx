import React, { useContext, useEffect, useRef } from 'react';
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
import { TurnIndicator } from './components/TurnIndicator';
import { Avatar, deriveAvatarEmotion, deriveAvatarName, GameEvents } from './components/Avatar';
import { StartScreen } from './components/StartScreen';
import { status } from './components/status';

const computerThinkingTime = 2200;

const GameBoards = () => {
  const { userShips, computerShips, playerTurn, setPlayerTurn, gameEnded, addToLog, aiLevel, avatar, setAvatar } =
    useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();

  useEffect(() => {
    // if (!gameEnded) {
    //   // addToLog(`${playerTurn} turn`, 'general');
    //   // TODO - there will be a UI element for this
    // }

    if (playerTurn === 'computer' && !gameEnded) {
      setTimeout(() => {
        setAvatar({ gameEvent: GameEvents.COMPUTER_THINKING });

        setTimeout(() => {
          makeComputerGuess();
          setPlayerTurn('user');
        }, computerThinkingTime / 2);
      }, computerThinkingTime / 2);
    }
  }, [playerTurn, gameEnded]);

  return (
    <>
      <StartScreen />
      <div className="game-container">
        <div
          className={`player-guess-board ${playerTurn === 'computer' ? 'computer-turn' : 'user-turn'}`}
          style={
            {
              // pointerEvents: playerTurn === 'computer' ? 'none' : 'auto',
              // cursor: playerTurn === 'computer' ? 'none' : 'auto',
            }
          }
        >
          {/* <h3>User guess board</h3> */}
          <div className="player-guess-board-inner">
            <UserGuessBoard />
            <TurnIndicator
              playerTurn={playerTurn === 'computer' ? `${deriveAvatarName(aiLevel)}'s turn` : 'Your turn'}
            />
          </div>
        </div>

        <Window title="" className={`computer-avatar ${deriveAvatarName(aiLevel)}`}>
          <Avatar gameEvent={avatar.gameEvent} />
        </Window>

        <Window title="status" className="status">
          <status />
        </Window>

        <Window title="Your fleet" className="player-fleet">
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
    </>
  );
};

export function App() {
  return (
    <GameProvider>
      <GameBoards />
    </GameProvider>
  );
}

export default App;
