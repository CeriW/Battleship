import React from 'react';
import './index.scss';
import Board from './components/Board';

import { placeShips } from './logic/placeShips';

export function App() {
  const computerShips = placeShips();
  console.log(computerShips);

  return (
    <>
      <Board positions={computerShips} />
    </>
  );
}

export default App;
