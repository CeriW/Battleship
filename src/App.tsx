import React, { useState } from 'react';
import './index.scss';

import { CellStates, PositionArray, ShipInfo } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';

import { placeShips, initialiseShipArray } from './logic/placeShips';
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
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [userShips, setUserShips] = useState<PositionArray>(initialiseShipArray());

  userShips[0][1] = { name: 'test', hit: CellStates.hit };
  userShips[1][0] = { name: 'test', hit: CellStates.hit };

  // userShips[1][1] = { name: 'test', hit: CellStates.miss };

  // userShips[2][4] = { name: 'test', hit: CellStates.miss };

  // userShips[5][5] = { name: 'test', hit: CellStates.hit };
  // userShips[5][4] = { name: 'test', hit: CellStates.hit };
  // userShips[5][6] = { name: 'test', hit: CellStates.hit };

  // userShips[3][3] = { name: 'test', hit: CellStates.hit };
  // userShips[2][3] = { name: 'test', hit: CellStates.hit };

  const heatMap = calculateHeatMap(userShips);

  // console.log(computerShips);

  return (
    <>
      <div id="boards">
        {/* <h3>Computer board</h3>
        <Board positions={computerShips} /> */}
        <h3>User board</h3>
        <Board positions={userShips} />
        <h3>Heat map</h3>
        <HeatMapBoard positions={heatMap} />
      </div>
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
      {/* <button onClick={() => makeGuess(userShips)}>Make guess</button> */}
    </>
  );
}

export default App;
