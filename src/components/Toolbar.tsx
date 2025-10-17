import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MusicButton } from './MusicButton';
import { SkipTrackButton } from './SkipTrackButton';
import { UnifiedCoordinateInput } from './UnifiedCoordinateInput';
import { GameContext } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import { checkAllShipsSunk, isShipSunk } from '../logic/helpers';
import { deriveAvatarName, GameEvents } from './Avatar';
import { playHitSound, playMissSound, playSuccessSound, playWinSound, fadeOutMusic } from '../utils/soundEffects';
import './Toolbar.scss';

export const Toolbar = () => {
  const { gameStatus, computerShips, setComputerShips, addToLog, setgameStatus, setAvatar, aiLevel } =
    useContext(GameContext);

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

      addToLog(`You guessed ${letters[row]}${col + 1}, hit`, 'hit');
      setAvatar({ gameEvent: GameEvents.USER_HIT });

      if (shipIsSunk) {
        playSuccessSound();
        addToLog(`You sunk ${deriveAvatarName(aiLevel)}'s ${cell?.name}`, 'sunk');
        setAvatar({ gameEvent: GameEvents.USER_SUNK_COMPUTER });

        setComputerShips(newComputerShips);

        if (checkAllShipsSunk(newComputerShips)) {
          fadeOutMusic();
          playWinSound();
          setgameStatus('user-win');
          setAvatar({ gameEvent: GameEvents.USER_WIN });
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

      addToLog(`You guessed ${letters[row]}${col + 1}, miss`, 'miss');
      setAvatar({ gameEvent: GameEvents.USER_MISS });
    }

    setgameStatus('computer-turn');
    userTurnInProgress.current = false;
  };

  // Only show coordinate input during user's turn
  const showCoordinateInput = gameStatus === 'user-turn';

  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <Link to="/about" className="toolbar-button about-button">
            <span className="about-icon">🔍</span>
            <span className="about-text">About</span>
          </Link>
          {showCoordinateInput && (
            <UnifiedCoordinateInput
              onGuess={handleGuess}
              disabled={gameStatus !== 'user-turn' || userTurnInProgress.current}
              variant="toolbar"
            />
          )}
        </div>
        <div className="toolbar-right">
          <SkipTrackButton />
          <MusicButton />
        </div>
      </div>
    </div>
  );
};
