import React from 'react';
type PositionArray = (string | null)[][]; // TODO - this is replicated in placeShips.ts on another branch

export default function Board() {
  const columnMarkers = [];
  for (let i = 0; i <= 10; i++) {
    columnMarkers.push(
      <div key={i} className="column-marker">
        {i === 0 ? '' : i}
      </div>
    );
  }

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rows = [];

  for (let i = 0; i < letters.length; i++) {
    const cells = [];
    for (let j = 0; j < 10; j++) {
      cells.push(<div key={`${letters[i]}-${j}`} className="cell"></div>);
    }

    rows.push(
      <>
        <div className="row-marker">{letters[i]}</div>
        {cells}
      </>
    );
  }

  return (
    <div className="board">
      {columnMarkers}
      {rows}
    </div>
  );
}
