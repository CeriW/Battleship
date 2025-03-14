/* istanbul ignore file */
import React, { createContext, useEffect, useState } from 'react';
import { PositionArray } from './types';
import { placeShips } from './logic/placeShips';

/* istanbul ignore next */
const calculateAdjacentShipModifier = (difficultyClass: number) => {
  switch (difficultyClass) {
    case 6:
      return 0.05;
    case 5:
      return 0.1;
    case 4:
      return 0.25;
    case 3:
      return 0.5;
    case 2:
      return 0.7;
    case 1:
      return 1;
    default:
      return 0;
  }
};

/* istanbul ignore next */
const calculateHeatMapIterations = (difficultyClass: number) =>
  difficultyClass > 10 ? difficultyClass * difficultyClass : difficultyClass;

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
  aiLevel: number;
  setAiLevel: (level: number) => void;

  // How likely it is that the AI will allow ships to be placed touching each other, used in combination with Math.random()
  // Level 1 has 100% chance of allowing adjacent placement. The next few subsequent levels may still allow it, but have progressively less chance of doing so.
  // This was previously simply a boolean based on the difficulty level, but despite being random it placed ships touching each other
  // with surprising frequency. It was not uncommon to have multiple and sometimes all ships touching each other.
  aiAdjacentShipModifier: number;
  setAiAdjacentShipModifier: (modifier: number) => void;

  // How many simulations to run when calculating the heat map
  // Higher numbers will generate more accurate heat maps
  heatMapSimulations: number;
  setHeatMapSimulations: (simulations: number) => void;
};

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userShips, setUserShips] = useState<PositionArray>(placeShips()); // TODO - have user place their own ships
  const [computerShips, setComputerShips] = useState<PositionArray>(placeShips());
  const [playerTurn, setPlayerTurn] = useState<'user' | 'computer'>(Math.random() > 0.5 ? 'user' : 'computer');
  const [log, setLog] = useState<string[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [aiLevel, setAiLevel] = useState<number>(20);
  const [aiAdjacentShipModifier, setAiAdjacentShipModifier] = useState<number>(calculateAdjacentShipModifier(aiLevel));
  const [heatMapSimulations, setHeatMapSimulations] = useState<number>(calculateHeatMapIterations(aiLevel));

  useEffect(() => {
    setAiAdjacentShipModifier(calculateAdjacentShipModifier(aiLevel));

    // TODO - This would ideally change when the AI level changes, but since I am reworking
    // the heatmap in the future anyway, it is not worth the fuss to figure out
    // why this breaks things so badly.
    // setHeatMapSimulations(calculateHeatMapIterations(aiLevel));
  }, [aiLevel]);

  const addToLog = (message: string) => {
    console.log(message);
    setLog((prevLog) => [`${message} - ${new Date().toISOString()}`, ...prevLog]);
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
        heatMapSimulations,
        setHeatMapSimulations,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
