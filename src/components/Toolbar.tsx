import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MusicButton } from './MusicButton';
import { SkipTrackButton } from './SkipTrackButton';
import { UnifiedCoordinateInput } from './UnifiedCoordinateInput';
import { AchievementButton } from './AchievementButton';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { checkAllShipsSunk, isShipSunk } from '../logic/helpers';
import { deriveAvatarName, GameEvents } from './Avatar';
import { playHitSound, playMissSound, playSuccessSound, playWinSound, fadeOutMusic } from '../utils/soundEffects';
import { useAchievementTracker } from '../hooks/useAchievementTracker';
import './Toolbar.scss';

export const Toolbar = () => {
  const { gameStatus, computerShips, setComputerShips, addToLog, setgameStatus, setAvatar, aiLevel } =
    useContext(GameContext);
  const { trackGameEvent } = useAchievementTracker();

  const userTurnInProgress = useRef(false);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleGuess = (row: number, col: number) => {
    if (gameStatus !== 'user-turn' || userTurnInProgress.current) {
      return;
    }

    const cell = computerShips[row][col];

    // Check if already guessed
    if (cell && (cell.status === CellStates.hit || cell.status === CellStates.miss)) {
      return;
    }

    userTurnInProgress.current = true;

    const newComputerShips = [...computerShips];
    const shipIsHere = cell && cell.name;

    if (shipIsHere) {
      newComputerShips[row][col] = { ...cell, status: CellStates.hit };
      const shipIsSunk = isShipSunk(cell.name as ShipNames, newComputerShips);

      addToLog(`You hit at ${letters[row]}${col + 1}!`, 'hit');
      setAvatar({ gameEvent: GameEvents.USER_HIT });
      trackGameEvent(GameEvents.USER_HIT, { position: [row, col] });

      if (shipIsSunk) {
        playSuccessSound();
        addToLog(`You sunk ${deriveAvatarName(aiLevel)}'s ${cell?.name}!`, 'sunk');
        setAvatar({ gameEvent: GameEvents.USER_SUNK_COMPUTER });
        trackGameEvent(GameEvents.USER_SUNK_COMPUTER, {
          shipName: cell?.name,
          oneShotKill: false, // TODO: Implement one-shot detection
        });

        setComputerShips(newComputerShips);

        if (checkAllShipsSunk(newComputerShips)) {
          fadeOutMusic();
          playWinSound();
          setgameStatus('user-win');
          setAvatar({ gameEvent: GameEvents.USER_WIN });
          trackGameEvent(GameEvents.USER_WIN, { aiLevel });
          userTurnInProgress.current = false;
          return;
        }
      } else {
        playHitSound();
        setComputerShips(newComputerShips);
      }
    } else {
      newComputerShips[row][col] = { name: null, status: CellStates.miss };

      playMissSound();
      setComputerShips(newComputerShips);

      addToLog(`You missed at ${letters[row]}${col + 1}`, 'miss');
      setAvatar({ gameEvent: GameEvents.USER_MISS });
      trackGameEvent(GameEvents.USER_MISS);
    }

    setgameStatus('computer-turn');
    userTurnInProgress.current = false;
  };

  // Always show coordinate input but fade when not user's turn
  const isUserTurn = gameStatus === 'user-turn';

  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <Link to="/about" className="toolbar-button about-button" title="About">
            <span className="about-icon">🔍</span>
            <span className="about-text">About</span>
          </Link>
          <div className={`coordinate-input-container ${!isUserTurn ? 'faded' : ''}`}>
            <UnifiedCoordinateInput
              onGuess={handleGuess}
              disabled={!isUserTurn || userTurnInProgress.current}
              variant="toolbar"
            />
          </div>
        </div>
        <div className="toolbar-right">
          <AchievementButton />
          <SkipTrackButton />
          <MusicButton />
        </div>
      </div>
    </div>
  );
};
