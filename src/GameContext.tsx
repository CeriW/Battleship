import React, { createContext, useState } from 'react';
import { PositionArray } from './types';
import { placeShips } from './logic/placeShips';

interface GameContextType {
  userShips: PositionArray;
  computerShips: PositionArray;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips] = useState<PositionArray>(placeShips());

  return <GameContext.Provider value={{ userShips, computerShips }}>{children}</GameContext.Provider>;
};
