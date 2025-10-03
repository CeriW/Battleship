import React, { useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { About } from './components/About';
import ShipPlacement from './components/ShipPlacement';

const computerThinkingTime = 700;

const GameBoards = () => {
  const { userShips, setUserShips, aiLevel, avatar, setAvatar, gameStatus, setgameStatus } = useContext(GameContext);
  const makeComputerGuess = useMakeComputerGuess();
  const computerTurnInProgress = useRef(false);

  const handleShipPlacementComplete = (ships: any) => {
    setUserShips(ships);
    setgameStatus('user-turn');
  };

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
      {gameStatus === 'unstarted' && <StartScreen />}
      {gameStatus === 'ship-placement' && <ShipPlacement onComplete={handleShipPlacementComplete} />}
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
      {gameStatus === 'user-win' && <GameEndScreen winner="user" />}
      {gameStatus === 'computer-win' && <GameEndScreen winner="computer" />}
    </>
  );
};

export function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <GameProvider>
                <GameBoards />
              </GameProvider>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
