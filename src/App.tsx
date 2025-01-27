import React, { useState } from 'react';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';
import UserGuessBoard from './components/UserGuessBoard';
import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
import { calculateHeatMap } from './logic/calculateHeatMap';

export const shipTypes: ShipInfo[] = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

export function App() {
  const [userShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips] = useState<PositionArray>(placeShips());

  return (
    <>
      <div id="boards">
        {/* <h3>Computer board</h3>
        <Board positions={computerShips} /> */}
        <h3>User guess board</h3>
        <UserGuessBoard />
        <h3>User board</h3>
        <Board positions={userShips} />
        <h3>Computer board</h3>
        <Board positions={computerShips} />
        <h3>Heat map</h3>
        <HeatMapBoard positions={calculateHeatMap(userShips)} />
      </div>
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
      {/* <button onClick={() => makeGuess(userShips)}>Make guess</button> */}
    </>
  );
}

export default App;
