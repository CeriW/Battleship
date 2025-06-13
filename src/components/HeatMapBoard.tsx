import React from 'react';
import { HeatValues } from '../logic/calculateHeatMap';

export const HeatMapBoard = ({ positions }: any) => {
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

  // Find the highest value in the positions array
  let maxValue = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (positions[y][x] !== HeatValues.hit) {
        maxValue = Math.max(maxValue, positions[y][x]);
      }
    }
  }

  for (let y = 0; y < letters.length; y++) {
    const cells = [];
    for (let x = 0; x < 10; x++) {
      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className="cell"
          style={{
            // TODO - Not sure if I'm sticking with this. Should move to CSS if I do.
            backgroundColor: positions[y][x] === maxValue ? 'black' : `rgba(255, 0, 0, ${positions[y][x] / 6})`,
            color: positions[y][x] >= maxValue ? 'white' : `black`,
            overflow: 'hidden',
            textAlign: 'left',
          }}
          data-testid="cell"
        >
          {positions[y][x] > 0 && positions[y][x] < HeatValues.hit ? `${positions[y][x].toFixed(2)}` : ''}
          {positions[y][x] === 0 ? '❌' : ''}
          {positions[y][x] === HeatValues.hit ? '✔️' : ''}
          {positions[y][x] === HeatValues.sunk ? '💀' : ''}
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
    <div className="board heat-map" data-testid="heatmap-board">
      {columnMarkers}
      {rows}
    </div>
  );
};

export default HeatMapBoard;
