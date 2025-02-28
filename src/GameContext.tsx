/* istanbul ignore file */
import React, { createContext, useState } from 'react';
import { PositionArray } from './types';
import { placeShips } from './logic/placeShips';

export type GameContextType = {
  userShips: PositionArray;
  computerShips: PositionArray;
  setUserShips: (ships: PositionArray) => void;
  setComputerShips: (ships: PositionArray) => void;
  playerTurn: 'user' | 'computer';
  setPlayerTurn: (turn: 'user' | 'computer') => void;
  log: string[];
  setLog: (log: string[]) => void;
};

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userShips, setUserShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [playerTurn, setPlayerTurn] = useState<'user' | 'computer'>('computer');
  const [log, setLog] = useState<string[]>([]);

  return (
    <GameContext.Provider
      value={{ userShips, setUserShips, computerShips, setComputerShips, playerTurn, setPlayerTurn, log, setLog }}
    >
      {children}
    </GameContext.Provider>
  );
};
