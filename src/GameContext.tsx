/* istanbul ignore file */
import React, { createContext, useEffect, useState, useRef } from 'react';
import { AiLevel, PositionArray } from './types';
import { placeShips } from './logic/placeShips';

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
  log: string[];
  addToLog: (message: string) => void;
  gameEnded: boolean;
  setGameEnded: (ended: boolean) => void;

  // How 'smart' the AI is, out of 20, with 1 being the easiest and 20 being the hardest
  aiLevel: AiLevel;
  setAiLevel: (level: AiLevel) => void;

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
  const [log, setLog] = useState<string[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [aiLevel, setAiLevel] = useState<AiLevel>('hard');
  const [aiAdjacentShipModifier, setAiAdjacentShipModifier] = useState<number>(calculateAdjacentShipModifier(aiLevel));

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousAiLevelRef = useRef<AiLevel>(aiLevel);

  useEffect(() => {
    setAiAdjacentShipModifier(calculateAdjacentShipModifier(aiLevel));
  }, [aiLevel]);

  const addToLog = (message: string) => {
    console.log(message);
    setLog((prevLog) => [`${message} - ${new Date().toISOString()}`, ...prevLog]);
  };

  const handleAiLevelChange = (level: AiLevel) => {
    setAiLevel(level);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (previousAiLevelRef.current !== level) {
        addToLog(`AI level changed to ${level}`);
        previousAiLevelRef.current = level;
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
        setAiLevel: handleAiLevelChange,
        aiAdjacentShipModifier,
        setAiAdjacentShipModifier,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
