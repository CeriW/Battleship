import React from 'react';

export default function Board() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="board" data-testid="board">
      <div className="column-marker">
        <BoardColumns row={'X'} startNum={0} />
      </div>
      {rows.map((row) => {
        return (
          <div key={row} className="row">
            <span className="row-marker">{row}</span>
            <BoardColumns row={row} />
          </div>
        );
      })}
    </div>
  );
}

interface BoardColumnsProps {
  row: string;
  startNum?: number;
  endNum?: number;
}

function BoardColumns({ row, startNum = 1, endNum = 10 }: BoardColumnsProps) {
  const numbers = [];

  for (let i = startNum; i <= endNum; i++) {
    numbers.push(
      <div key={i} className="cell" data-column={i} data-row={row}>
        {i}
      </div>
    );
  }

  return <>{numbers}</>;
}
