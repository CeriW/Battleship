import React, { useState } from 'react';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
import { calculateHeatMapV2, generateMatchingBoard } from './logic/calculateHeatMap';

export const shipTypes: ShipInfo[] = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

export function App() {
  // const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [userShips] = useState<PositionArray>(placeShips());

  userShips[5][5] = { name: null, status: CellStates.hit };
  userShips[5][6] = { name: null, status: CellStates.miss };

  // const heatMap = calculateHeatMap(userShips);
  // console.log('heatMap', heatMap);
  // console.log('placeShipsV2', generateMatchingBoard(userShips));
  // console.log('placeShipsV2', generateMatchingBoard(userShips));

  calculateHeatMapV2(userShips);

  return (
    <>
      <div id="boards">
        {/* <h3>Computer board</h3>
        <Board positions={computerShips} /> */}
        <h3>User board</h3>
        <Board positions={userShips} />
        <h3>Heat map</h3>
        <HeatMapBoard positions={calculateHeatMapV2(userShips)} />
      </div>
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
      {/* <button onClick={() => makeGuess(userShips)}>Make guess</button> */}
    </>
  );
}

export default App;
