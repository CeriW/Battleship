import React, { useContext, useEffect, useRef } from 'react';
import { GameContext, GameProvider } from './GameContext';
import './index.scss';
import Window from './components/Window';

import Board from './components/Board';
import { useMakeComputerGuess } from './logic/makeComputerGuess';

import UserGuessBoard from './components/UserGuessBoard';
import { Log } from './components/Log';

import { TurnIndicator } from './components/TurnIndicator';
import { Avatar, deriveAvatarName, GameEvents } from './components/Avatar';
import { Status } from './components/Status';

import { StartScreen } from './components/StartScreen';
import { GameEndScreen } from './logic/GameEndScreen';

const computerThinkingTime = 700;

const GameBoards = () => {
  const { userShips, aiLevel, avatar, setAvatar, gameStatus, setgameStatus } = useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();
  const computerTurnInProgress = useRef(false);

  useEffect(() => {
    if (gameStatus === 'computer-turn' && !computerTurnInProgress.current) {
      computerTurnInProgress.current = true;

      setTimeout(() => {
        setAvatar({ gameEvent: GameEvents.COMPUTER_THINKING });

        setTimeout(() => {
          makeComputerGuess();
          computerTurnInProgress.current = false;
        }, computerThinkingTime / 2);
      }, computerThinkingTime / 2);
    }
  }, [gameStatus, makeComputerGuess, setAvatar, setgameStatus]);

  return (
    <>
      <GameEndScreen winner={'computer'} />
      {gameStatus === 'unstarted' && <StartScreen />}
      {gameStatus === 'user-win' && <GameEndScreen winner="user" />}
      {gameStatus === 'computer-win' && <GameEndScreen winner="computer" />}
      {(gameStatus === 'user-turn' || gameStatus === 'computer-turn') && (
        <div className="game-container">
          <div className={`player-guess-board ${gameStatus === 'computer-turn' ? 'computer-turn' : 'user-turn'}`}>
            <div className="player-guess-board-inner">
              <UserGuessBoard />
              <TurnIndicator
                playerTurn={gameStatus === 'computer-turn' ? `${deriveAvatarName(aiLevel)}'s turn` : 'Your turn'}
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
        </div>
      )}
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
