import './index.scss';
import Board from './components/Board';

import { initialiseShipArray, placeShips } from './logic/placeShips';

export function App() {
  const computerShips = initialiseShipArray();
  placeShips();
  console.log(computerShips);

  return (
    <>
      <Board />
      <Board />
      <Board />
    </>
  );
}

export default App;
