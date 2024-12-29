import React from 'react';
import './index.scss';
import Board from './components/Board';

import { placeShips } from './logic/placeShips';
import { difficultyClass, ai } from './ai-behaviour';

export function App() {
  const computerShips = placeShips();

  return (
    <>
      <Board positions={computerShips} />
      <div>Difficulty: {difficultyClass}</div>
      <div>{JSON.stringify(ai, null, 2)}</div>
    </>
  );
}

export default App;
