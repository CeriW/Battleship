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
import { Status } from './components/Status';
import Confetti from 'react-confetti'

const computerThinkingTime = 1000;

const GameBoards = () => {
  const { userShips, computerShips, playerTurn, setPlayerTurn, aiLevel, avatar, setAvatar, gameStatus } =
    useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();
  const computerTurnInProgress = useRef(false);

  useEffect(() => {
    // if (!gameEnded) {
    //   // addToLog(`${playerTurn} turn`, 'general');
    //   // TODO - there will be a UI element for this
    // }

    if (playerTurn === 'computer' && gameStatus === 'in-progress' && !computerTurnInProgress.current) {
      computerTurnInProgress.current = true;

      setTimeout(() => {
        setAvatar({ gameEvent: GameEvents.COMPUTER_THINKING });

        setTimeout(() => {
          makeComputerGuess();
          setPlayerTurn('user');
          computerTurnInProgress.current = false;
        }, computerThinkingTime / 2);
      }, computerThinkingTime / 2);
    }
  }, [playerTurn, gameStatus, makeComputerGuess, setPlayerTurn, setAvatar]);

  return (
    <>
      {gameStatus === 'unstarted' && <StartScreen />}
      {gameStatus === 'user-win' && <Confetti />}
      {gameStatus === 'computer-win' && <Confetti />}
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
          <Status />
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
