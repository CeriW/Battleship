import React from 'react';
import { CellStates, ShipNames } from '../types';
import { GameContext } from '../GameContext';
import { checkAllShipsSunk, isShipSunk } from '../logic/helpers';
import { HitIcon, MissIcon } from './Icons';
import { deriveAvatarName, GameEvents } from './Avatar';
import AimInterface from './AimInterface';

export const UserGuessBoard: React.FC = () => {
  const { computerShips, setComputerShips, addToLog, gameStatus, setgameStatus, setAvatar, aiLevel } =
    React.useContext(GameContext);

  const userTurnInProgress = React.useRef(false);
  const [duplicateGuess, setDuplicateGuess] = React.useState<{ row: number; col: number } | null>(null);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleGuess = (row: number, col: number) => {
    if (gameStatus !== 'user-turn' || userTurnInProgress.current) {
      return;
    }

    const cell = computerShips[row][col];

    // Check if already guessed and provide feedback
    if (cell && (cell.status === CellStates.hit || cell.status === CellStates.miss)) {
      setDuplicateGuess({ row, col });

      // Clear the duplicate feedback after 2 seconds
      setTimeout(() => {
        setDuplicateGuess(null);
      }, 2000);
      return;
    }

    userTurnInProgress.current = true;

    const newComputerShips = [...computerShips];
    const shipIsHere = cell && cell.name;

    if (shipIsHere) {
      newComputerShips[row][col] = { ...cell, status: CellStates.hit };
      const shipIsSunk = isShipSunk(cell.name as ShipNames, newComputerShips);
      newComputerShips[row][col] = { ...cell, status: CellStates.hit };

      addToLog(`You guessed ${letters[row]}${col + 1}, hit`, 'hit');
      setAvatar({ gameEvent: GameEvents.USER_HIT });

      if (shipIsSunk) {
        addToLog(`You sunk ${deriveAvatarName(aiLevel)}'s ${cell?.name}`, 'sunk');
        setAvatar({ gameEvent: GameEvents.USER_SUNK_COMPUTER });

        // Update the state immediately for game logic
        setComputerShips(newComputerShips);

        // Check for game end after state update
        if (checkAllShipsSunk(newComputerShips)) {
          setgameStatus('user-win');
          setAvatar({ gameEvent: GameEvents.USER_WIN });
          userTurnInProgress.current = false;
          return; // Exit early if user won
        }
      }
    } else {
      newComputerShips[row][col] = { name: null, status: CellStates.miss };
      setComputerShips(newComputerShips);
      addToLog(`You guessed ${letters[row]}${col + 1}, miss`, 'miss');
      setAvatar({ gameEvent: GameEvents.USER_MISS });
    }

    setgameStatus('computer-turn');
    userTurnInProgress.current = false;
  };

  const columnMarkers = [];
  for (let i = 0; i <= 10; i++) {
    columnMarkers.push(
      <div key={`column-marker-${i}`} className="column-marker" data-testid="column-marker">
        {i === 0 ? '' : i}
      </div>
    );
  }

  const rows = [];

  // Used to assign classes like carrier-1, carrier-2 etc to individual cells for styling
  const shipCounts: { [key: string]: number } = {
    carrier: 0,
    battleship: 0,
    cruiser: 0,
    submarine: 0,
    destroyer: 0,
  };

  for (let y = 0; y < letters.length; y++) {
    const cells = [];
    for (let x = 0; x < 10; x++) {
      const cell = computerShips[y][x];
      if (cell?.name) {
        shipCounts[cell.name as ShipNames]++;
      }

      const shipClass = cell?.name ? `ship ${cell.name} ${cell.name}-${shipCounts[cell.name as ShipNames]}` : '';

      const shipIsSunk = cell?.name ? isShipSunk(cell.name as ShipNames, computerShips) : false;

      const isDuplicate = duplicateGuess && duplicateGuess.row === y && duplicateGuess.col === x;

      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className={`cell ${shipClass} ${shipIsSunk ? 'sunk' : cell?.status || 'unguessed'} ${
            isDuplicate ? 'duplicate-guess' : ''
          } ${gameStatus !== 'user-turn' ? 'disabled' : ''}`}
          data-testid="cell"
          onClick={() => handleGuess(y, x)}
        >
          {cell?.status === CellStates.hit && !shipIsSunk && <HitIcon />}
          {cell?.status === CellStates.miss && <MissIcon />}
          {cell?.status === CellStates.unguessed && ''}
        </div>
      );
    }

    rows.push(
      <div className="row" key={`row-${y}`}>
        <div className="row-marker" key={`row-marker-${y}`} data-testid="row-marker">
          {letters[y]}
        </div>
        {cells}
      </div>
    );
  }

  return (
    <div className="user-guess-board" data-testid="user-guess-board-container">
      {/* Coordinate Input as Additional Option */}
      <AimInterface onGuess={handleGuess} disabled={gameStatus !== 'user-turn' || userTurnInProgress.current} />

      {/* Original Clickable Grid */}
      <div className="board user-guess-board-grid" data-testid="user-guess-board-grid">
        {columnMarkers}
        {rows}
      </div>
    </div>
  );
};

export default UserGuessBoard;
