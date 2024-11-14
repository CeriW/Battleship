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
      {rows.map((row) => {
        const columns = [];
        for (let i = 1; i <= 10; i++) {
          columns.push(
            <span key={i} className="number">
              {i}
            </span>
          );
        }

        return (
          <div key={row} className="row">
            <span className="row-marker">{row}</span>
            {columns}
          </div>
        );
      })}
    </div>
  );
};

export default App;
