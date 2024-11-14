import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <>
      <Board />
    </>
  );
}

const Board = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="board">
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
};

interface BoardColumnsProps {
  row: string;
  startNum?: number;
  endNum?: number;
}

const BoardColumns = ({ row, startNum = 1, endNum = 10 }: BoardColumnsProps) => {
  const numbers = [];

  for (let i = startNum; i <= endNum; i++) {
    numbers.push(
      <div key={i} className="cell" data-column={i} data-row={row}>
        {i}
      </div>
    );
  }

  return <>{numbers}</>;
};

export default App;
