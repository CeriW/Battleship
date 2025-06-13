import React from 'react';
import { PositionArray, CellStates } from '../types';

interface BoardProps {
  positions: PositionArray;
}

export const Board: React.FC<BoardProps> = ({ positions }) => {
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
          className={`cell ${positions[y][x]?.name ?? ''} ${
            positions[y][x]?.status ?? ''
          } border border-white border-opacity-40`}
          data-testid="cell"
        >
          {positions[y][x]?.status === CellStates.hit && '🔥'}
          {positions[y][x]?.status === CellStates.miss && '❌'}
        </div>
      );
    }

    rows.push(
      <div className="row grid grid-cols-[repeat(11,1fr)]" key={`row-${y}`}>
        <div className="row-marker border-white border-r-4" key={`row-marker-${y}`} data-testid="row-marker">
          {letters[y]}
        </div>
        {cells}
      </div>
    );
  }

  return (
    <div className="board" data-testid="board">
      <div className="grid grid-cols-[repeat(11,1fr)]">{columnMarkers}</div>
      {rows}
    </div>
  );
};

export default Board;
