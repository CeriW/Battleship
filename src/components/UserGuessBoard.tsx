import React from 'react';
import { CellStates, ShipNames } from '../types';
import { GameContext } from '../GameContext';
import { checkAllShipsSunk, declareWinner, isShipSunk } from '../logic/helpers';

export const UserGuessBoard: React.FC = () => {
  const { computerShips, setComputerShips, playerTurn, setPlayerTurn, addToLog } = React.useContext(GameContext);

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
      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className={`cell ${computerShips[y][x]?.status || ''}`}
          data-testid="cell"
          onClick={() => {
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
              newComputerShips[y][x] = { ...cell, status: CellStates.hit, sunk: false };
              const shipIsSunk = isShipSunk(cell.name as ShipNames, newComputerShips);
              newComputerShips[y][x] = { ...cell, status: CellStates.hit, sunk: shipIsSunk };

              addToLog(`User guessed ${letters[y]}${x + 1}, hit`);
              if (shipIsSunk) {
                addToLog(`User sunk ${cell?.name}`);
                setComputerShips(newComputerShips);

                if (checkAllShipsSunk(newComputerShips)) {
                  addToLog(declareWinner('user'));
                }
              }
            } else {
              newComputerShips[y][x] = { name: null, status: CellStates.miss, sunk: false };
              setComputerShips(newComputerShips);
              addToLog(`User guessed ${letters[y]}${x + 1}, miss`);
            }

            setPlayerTurn('computer');
            // setUserShips(newComputerShips); // TODO - Remove this, it's wrong, it's just for testing the heat map
          }}
        >
          {computerShips[y][x]?.status === CellStates.hit && '✔️'}
          {computerShips[y][x]?.status === CellStates.miss && '❌'}
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
