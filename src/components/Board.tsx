import React from 'react';

type PositionArray = (string | null)[][]; // TODO - this is replicated in placeShips.ts on another branch

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

  for (let i = 0; i < letters.length; i++) {
    const cells = [];
    for (let j = 0; j < 10; j++) {
      cells.push(
        <div key={`cell-${letters[i]}-${j}`} className={`cell ${positions[i][j] ?? ''}`} data-testid="cell"></div>
      );
    }

    rows.push(
      <div className="row" key={`row-${i}`}>
        <div className="row-marker" key={`row-marker-${i}`} data-testid="row-marker">
          {letters[i]}
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
