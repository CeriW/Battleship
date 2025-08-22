import React from 'react';
import { CellStates, ShipNames } from '../types';
import { GameContext } from '../GameContext';
import { checkAllShipsSunk, isShipSunk } from '../logic/helpers';
import { HitIcon, MissIcon } from './Icons';
import { deriveAvatarName, GameEvents } from './Avatar';
import { declareWinner } from '../logic/GameEndScreen';

export const UserGuessBoard: React.FC = () => {
  const {
    computerShips,
    setComputerShips,
    playerTurn,
    setPlayerTurn,
    addToLog,
    gameStatus,
    setgameStatus,
    setAvatar,
    aiLevel,
  } = React.useContext(GameContext);

  const userTurnInProgress = React.useRef(false);

  const columnMarkers = [];
  for (let i = 0; i <= 10; i++) {
    columnMarkers.push(
      <div key={`column-marker-${i}`} className="column-marker" data-testid="column-marker">
        {i === 0 ? '' : i}
      </div>
    );
  }

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
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

      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className={`cell ${shipClass} ${shipIsSunk ? 'sunk' : cell?.status || 'unguessed'}`}
          data-testid="cell"
          onClick={() => {
            if ((gameStatus !== 'in-progress' && gameStatus !== 'unstarted') || userTurnInProgress.current) {
              return;
            }

            // Jest tests are unable to detect pointer-events: none
            if (
              (cell && (cell.status === CellStates.hit || cell.status === CellStates.miss)) ||
              playerTurn === 'computer'
            ) {
              return;
            }

            userTurnInProgress.current = true;

            const newComputerShips = [...computerShips];
            const shipIsHere = cell && cell.name;

            if (shipIsHere) {
              newComputerShips[y][x] = { ...cell, status: CellStates.hit };
              const shipIsSunk = isShipSunk(cell.name as ShipNames, newComputerShips);
              newComputerShips[y][x] = { ...cell, status: CellStates.hit };

              addToLog(`You guessed ${letters[y]}${x + 1}, hit`, 'hit');
              setAvatar({ gameEvent: GameEvents.USER_HIT });

              if (shipIsSunk) {
                addToLog(`You sunk ${deriveAvatarName(aiLevel)}'s ${cell?.name}`, 'sunk');
                setAvatar({ gameEvent: GameEvents.USER_SUNK_COMPUTER });

                // Update the state immediately for game logic
                setComputerShips(newComputerShips);

                // Check for game end after state update
                if (checkAllShipsSunk(newComputerShips)) {
                  addToLog('user wins', 'user-win'); // TODO - roll this into declareWinner
                  declareWinner('user');
                  setgameStatus('user-win');
                  setAvatar({ gameEvent: GameEvents.USER_WIN });
                }
              }
            } else {
              newComputerShips[y][x] = { name: null, status: CellStates.miss };
              setComputerShips(newComputerShips);
              addToLog(`You guessed ${letters[y]}${x + 1}, miss`, 'miss');
              setAvatar({ gameEvent: GameEvents.USER_MISS });
            }

            setPlayerTurn('computer');
            userTurnInProgress.current = false;
          }}
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
    <div className="board user-guess-board" data-testid="user-guess-board">
      {columnMarkers}
      {rows}
    </div>
  );
};

export default UserGuessBoard;
