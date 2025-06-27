import React from 'react';
import { PositionArray, CellStates } from '../types';
import { HitIcon, MissIcon } from './Icons';

interface BoardProps {
  positions: PositionArray;
  icons?: 'dark' | 'light';
}

export const Board: React.FC<BoardProps> = ({ positions, icons = 'dark' }) => {
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
          className={`cell ${positions[y][x]?.name ?? ''} ${positions[y][x]?.status ?? ''}`}
          data-testid="cell"
          // onClick={() => {
          //   console.log(i, j);
          // }}
          // style={{ cursor: onCellClick ? 'pointer' : 'default' }}
        >
          {positions[y][x]?.status === CellStates.hit && <HitIcon />}
          {positions[y][x]?.status === CellStates.miss && <MissIcon fill={icons === 'light' ? '#fff' : '#000'} />}
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

export default Board;
