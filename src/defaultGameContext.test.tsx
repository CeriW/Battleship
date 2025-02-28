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
