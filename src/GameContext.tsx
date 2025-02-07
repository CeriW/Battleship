import React, { createContext, useState } from 'react';
import { PositionArray } from './types';
import { placeShips } from './logic/placeShips';

interface GameContextType {
  userShips: PositionArray;
  computerShips: PositionArray;
  setUserShips: (ships: PositionArray) => void;
  setComputerShips: (ships: PositionArray) => void;
  turn: 'user' | 'computer';
  setTurn: (turn: 'user' | 'computer') => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userShips, setUserShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [turn, setTurn] = useState<'user' | 'computer'>('user');

  return (
    <GameContext.Provider value={{ userShips, setUserShips, computerShips, setComputerShips, turn, setTurn }}>
      {children}
    </GameContext.Provider>
  );
};
