import React, { useState } from 'react';
import './index.scss';

import { PositionArray } from './logic/placeShips';
import Board from './components/Board';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';
// import makeGuess from './logic/guess';

import { initialiseHeatMap } from './logic/guess';

export function App() {
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [userShips, setUserShips] = useState<PositionArray>(placeShips());

  userShips[1][1] = { name: 'test', hit: true };
  userShips[1][2] = { name: 'test', hit: true };

  initialiseHeatMap(userShips);

  // console.log(computerShips);

  return (
    <>
      <div id="boards">
        <h3>Computer board</h3>
        <Board positions={computerShips} />
        <h3>User board</h3>
        <Board positions={userShips} />
      </div>
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
      {/* <button onClick={() => makeGuess(userShips)}>Make guess</button> */}
    </>
  );
}

export default App;
