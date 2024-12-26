import './index.scss';
import Board from './components/Board';

import { initialiseShipArray, placeShips } from './logic/placeShips';

// TODO - needs to take an array from placeShips.ts
const computerShips = [
  ['carrier', 'carrier', 'carrier', 'carrier', 'carrier', null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, 'battleship', 'battleship', 'battleship', 'battleship', null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ['cruiser', null, null, null, null, null, 'submarine', null, null, null],
  ['cruiser', null, null, null, null, null, 'submarine', null, null, null],
  ['cruiser', null, null, null, null, null, 'submarine', null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, 'destroyer', 'destroyer'],
];

export function App() {
  const computerShips = initialiseShipArray();
  placeShips();
  // console.log(computerShips);

  return (
    <>
      <Board positions={computerShips} />
    </>
  );
}

export default App;
