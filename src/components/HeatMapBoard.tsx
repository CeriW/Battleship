import React from 'react';
import { HeatMapArray } from '../types';
import { ai } from '../ai-behaviour';

// interface HeatMapBoardProps {
//   positions: number[][];
// }

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

  for (let i = 0; i < letters.length; i++) {
    const cells = [];
    for (let j = 0; j < 10; j++) {
      const percentageDecimal = positions[i][j] / ai.heatMapSimulations;
      const percentage = (percentageDecimal * 100).toFixed(1);

      // console.log(percentage);

      cells.push(
        <div
          key={`cell-${letters[i]}-${j}`}
          className="cell"
          style={{ backgroundColor: `rgba(255, 0, 0, ${percentageDecimal})` }}
          data-testid="cell"
        >
          {positions[i][j] > 0 && positions[i][j] < ai.heatMapSimulations ? percentage + '%' : ''}
          {positions[i][j] === 0 ? '❌' : ''}
          {positions[i][j] === ai.heatMapSimulations ? '✔️' : ''}
        </div>
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
    <div className="board heat-map" data-testid="heatmap-board">
      {columnMarkers}
      {rows}
    </div>
  );
};

export default HeatMapBoard;
