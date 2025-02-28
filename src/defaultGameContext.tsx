/* istanbul ignore file */

// This is intended for test usage only, not for production

import { GameContextType } from './GameContext';

export const defaultTestContext: GameContextType = {
  setUserShips: jest.fn(),
  setComputerShips: jest.fn(),
  setPlayerTurn: jest.fn(),
  userShips: [],
  computerShips: [],
  playerTurn: 'computer',
  log: [],
  addToLog: () => {},
};

export default defaultTestContext;
