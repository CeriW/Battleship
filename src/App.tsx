import React, { useState } from 'react';
import './index.scss';

import { PositionArray } from './types';
import Board from './components/Board';
import HeatMapBoard from './components/HeatMapBoard';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
import { calculateHeatMap } from './logic/calculateHeatMap';

export function App() {
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [userShips, setUserShips] = useState<PositionArray>(placeShips());

  // userShips[1][1] = { name: 'test', hit: true };
  userShips[5][5] = { name: 'test', hit: true };
  userShips[5][4] = { name: 'test', hit: true };
  // userShips[5][6] = { name: 'test', hit: true };

  // userShips[3][2] = { name: 'test', hit: true };
  // userShips[2][0] = { name: 'test', hit: true };

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
