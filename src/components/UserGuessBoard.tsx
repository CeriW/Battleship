import React from 'react';
import { CellStates, ShipNames } from '../types';
import { GameContext } from '../GameContext';
import { checkAllShipsSunk, declareWinner, isShipSunk } from '../logic/helpers';
import { HitIcon, MissIcon } from './Icons';

export const UserGuessBoard: React.FC = () => {
  const { computerShips, setComputerShips, playerTurn, setPlayerTurn, addToLog, gameEnded, setGameEnded } =
    React.useContext(GameContext);

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

  for (let y = 0; y < letters.length; y++) {
    const cells = [];
    for (let x = 0; x < 10; x++) {
      const shipIsSunk = isShipSunk(computerShips[y][x]?.name as ShipNames, computerShips);

      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className={`cell ${shipIsSunk ? 'sunk' : computerShips[y][x]?.status || 'unguessed'}`}
          data-testid="cell"
          onClick={() => {
            if (gameEnded) {
              return;
            }

            // Jest tests are unable to detect pointer-events: none
            const cell = computerShips[y][x];
            if (
              (cell && (cell.status === CellStates.hit || cell.status === CellStates.miss)) ||
              playerTurn === 'computer'
            ) {
              return;
            }

            const newComputerShips = [...computerShips];
            const shipIsHere = cell && cell.name;

            if (shipIsHere) {
              newComputerShips[y][x] = { ...cell, status: CellStates.hit };
              // const shipIsSunk = isShipSunk(cell.name as ShipNames, newComputerShips);
              newComputerShips[y][x] = { ...cell, status: CellStates.hit };

              addToLog(`User guessed ${letters[y]}${x + 1}, hit`);
              if (shipIsSunk) {
                addToLog(`User sunk ${cell?.name}`);
                setComputerShips(newComputerShips);

                if (checkAllShipsSunk(newComputerShips)) {
                  addToLog('user wins');
                  declareWinner('user');
                  setGameEnded(true);
                }
              }
            } else {
              newComputerShips[y][x] = { name: null, status: CellStates.miss };
              setComputerShips(newComputerShips);
              addToLog(`User guessed ${letters[y]}${x + 1}, miss`);
            }

            setPlayerTurn('computer');
          }}
        >
          {/* TODO - sunk ship icon */}
          {computerShips[y][x]?.status === CellStates.hit && shipIsSunk && '💀'}
          {computerShips[y][x]?.status === CellStates.hit && !shipIsSunk && <HitIcon />}
          {computerShips[y][x]?.status === CellStates.miss && <MissIcon />}
          {computerShips[y][x]?.status === CellStates.unguessed && ''}
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
