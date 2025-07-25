/* istanbul ignore file */
import React, { createContext, useEffect, useState } from 'react';
import { AiLevel, PositionArray } from './types';
import { placeShips } from './logic/placeShips';
import { LogEntry, LogEntryTypes } from './components/Log';
import { GameEvents } from './components/Avatar';

/* istanbul ignore next */
const calculateAdjacentShipModifier = (aiLevel: AiLevel) => {
  switch (aiLevel) {
    case 'hard':
      return 0;
    case 'medium':
      return 0.7;
    case 'easy':
      return 1;
    default:
      return 0;
  }
};

export type GameContextType = {
  userShips: PositionArray;
  computerShips: PositionArray;
  setUserShips: (ships: PositionArray) => void;
  setComputerShips: (ships: PositionArray) => void;
  playerTurn: 'user' | 'computer';
  setPlayerTurn: (turn: 'user' | 'computer') => void;
  log: React.ReactNode[];
  addToLog: (message: string, type: LogEntryTypes) => void;
  gameEnded: boolean;
  setGameEnded: (ended: boolean) => void;
  aiLevel: AiLevel;
  setAiLevel: (level: AiLevel) => void;
  avatar: { gameEvent: GameEvents };
  setAvatar: (avatar: { gameEvent: GameEvents }) => void;

  // How likely it is that the AI will allow ships to be placed touching each other, used in combination with Math.random()
  // Level 1 has 100% chance of allowing adjacent placement. The next few subsequent levels may still allow it, but have progressively less chance of doing so.
  // This was previously simply a boolean based on the difficulty level, but despite being random it placed ships touching each other
  // with surprising frequency. It was not uncommon to have multiple and sometimes all ships touching each other.
  aiAdjacentShipModifier: number;
  setAiAdjacentShipModifier: (modifier: number) => void;
};

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userShips, setUserShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [playerTurn, setPlayerTurn] = useState<'user' | 'computer'>(Math.random() > 0.5 ? 'user' : 'computer');
  const [log, setLog] = useState<React.ReactNode[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [aiLevel, setAiLevel] = useState<AiLevel>('hard');
  const [aiAdjacentShipModifier, setAiAdjacentShipModifier] = useState<number>(calculateAdjacentShipModifier(aiLevel));

  const [avatar, setAvatar] = useState<{ gameEvent: GameEvents }>({
    gameEvent: GameEvents.COMPUTER_THINKING,
  });

  useEffect(() => {
    setAiAdjacentShipModifier(calculateAdjacentShipModifier(aiLevel));
  }, [aiLevel]);

  const addToLog = (message: string, type: LogEntryTypes) => {
    console.log(message);
    setLog((prevLog) => [<LogEntry key={new Date().toISOString()} item={message} type={type} />, ...prevLog]);
  };

  return (
    <GameContext.Provider
      value={{
        userShips,
        setUserShips,
        computerShips,
        setComputerShips,
        playerTurn,
        setPlayerTurn,
        log,
        addToLog,
        gameEnded,
        setGameEnded,
        aiLevel,
        setAiLevel,
        aiAdjacentShipModifier,
        setAiAdjacentShipModifier,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
