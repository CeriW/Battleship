import React from 'react';
import './index.scss';
import Board from './components/Board';

import { placeShips } from './logic/placeShips';

export function App() {
  const computerShips = placeShips();

  return (
    <>
      <Board positions={computerShips} />
    </>
  );
}

export default App;
