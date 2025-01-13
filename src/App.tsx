import React, { useState } from 'react';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';

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
  // const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [userShips] = useState<PositionArray>(placeShips());

  userShips[5][5] = { name: null, status: CellStates.hit };
  // userShips[5][4] = { name: null, status: CellStates.miss };
  // userShips[5][6] = { name: null, status: CellStates.miss };

  // userShips[9][0] = { name: null, status: CellStates.hit };
  // userShips[9][1] = { name: null, status: CellStates.hit };

  // userShips[1][0] = { name: null, status: CellStates.hit };
  // userShips[1][1] = { name: null, status: CellStates.hit };
  // userShips[1][2] = { name: null, status: CellStates.miss };

  // userShips[0][0] = { name: null, status: CellStates.miss };

  // calculateHeatMap(userShips);

  console.log(ai.heatMapSimulations);

  return (
    <>
      <div id="boards">
        {/* <h3>Computer board</h3>
        <Board positions={computerShips} /> */}
        <h3>User board</h3>
        <Board positions={userShips} />
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
