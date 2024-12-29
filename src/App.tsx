import React from 'react';
import './index.scss';
import Board from './components/Board';

import { placeShips } from './logic/placeShips';
import { difficultyClass } from './ai-behaviour';

export function App() {
  const computerShips = placeShips();

  return (
    <>
      <Board positions={computerShips} />
      <div>Difficulty: {difficultyClass}</div>
    </>
  );
}

export default App;
