/* istanbul ignore file */

// This is intended for test usage only, not for production

import { GameEvents } from './components/Avatar';
import { GameContextType } from './GameContext';

export const defaultTestContext: GameContextType = {
  setUserShips: jest.fn(),
  setComputerShips: jest.fn(),

  userShips: [],
  computerShips: [],

  log: [],
  addToLog: () => {},
  gameStatus: 'user-turn',
  setgameStatus: jest.fn(),
  aiLevel: 'hard',
  setAiLevel: jest.fn(),
  aiAdjacentShipModifier: 0,
  setAiAdjacentShipModifier: jest.fn(),
  avatar: { gameEvent: GameEvents.COMPUTER_THINKING },
  setAvatar: jest.fn(),
};

export default defaultTestContext;
