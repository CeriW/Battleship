import React from 'react';
import { CellStates, PositionArray } from '../types';
import { GameContext } from '../GameContext';
interface BoardProps {
  // positions: PositionArray;
}

export const UserGuessBoard: React.FC<BoardProps> = () => {
  const { userShips, setUserShips, computerShips, setComputerShips } = React.useContext(GameContext);

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
          // className={`cell ${positions[i][j]?.name ?? ''}`}
          className="cell"
          data-testid="cell"
          onClick={() => {
            console.log(y, x);
            console.log(computerShips);

            const newComputerShips = [...computerShips];
            const shipIsHere = !!newComputerShips[y][x];

            if (shipIsHere) {
              newComputerShips[y][x].status = CellStates.hit;
            } else {
              newComputerShips[y][x] = { name: null, status: CellStates.miss };
            }

            setComputerShips(newComputerShips);
            setUserShips(newComputerShips); // TODO - Remove this, it's wrong, it's just for testing the heat map

            // setComputerShips(newComputerShips);
            // setComputerShips(newComputerShips);
          }}
          // style={{ cursor: onCellClick ? 'pointer' : 'default' }}
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
    <div className="board" data-testid="board">
      {columnMarkers}
      {rows}
    </div>
  );
};

export default UserGuessBoard;
