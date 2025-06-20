import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import UserGuessBoard from '../components/UserGuessBoard';
import { GameContext, GameContextType } from '../GameContext';
import { CellStates, AiLevel } from '../types';
import { initialiseShipArray } from '../logic/placeShips';

// Mock GameContext values
const createMockContext = (overrides: Partial<GameContextType> = {}): GameContextType => ({
  userShips: initialiseShipArray(),
  computerShips: initialiseShipArray(),
  setUserShips: () => {},
  setComputerShips: () => {},
  playerTurn: 'user' as const,
  setPlayerTurn: () => {},
  log: [],
  addToLog: () => {},
  gameEnded: false,
  setGameEnded: () => {},
  aiLevel: 'hard' as AiLevel,
  setAiLevel: () => {},
  aiAdjacentShipModifier: 0,
  setAiAdjacentShipModifier: () => {},
  ...overrides,
});

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'User Guess Board',
  component: UserGuessBoard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context: { args: { contextOverrides?: Partial<GameContextType> } }) => {
      const mockContext = createMockContext(context.args.contextOverrides || {});
      return (
        <GameContext.Provider value={mockContext}>
          <div style={{ width: '450px', maxWidth: '100%', margin: '10px' }}>
            <Story />
          </div>
        </GameContext.Provider>
      );
    },
  ],
  argTypes: {
    contextOverrides: {
      control: false,
      description: 'Mock context overrides for testing different states',
    },
  },
} satisfies Meta<typeof UserGuessBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create board with specific hits and misses
const createGameInProgressBoard = () => {
  const positions = initialiseShipArray();

  // Add some hits
  positions[1][1] = { name: 'carrier', status: CellStates.hit };
  positions[1][4] = { name: 'carrier', status: CellStates.hit };
  positions[1][5] = { name: 'carrier', status: CellStates.hit };
  positions[5][5] = { name: 'battleship', status: CellStates.hit };
  positions[5][6] = { name: 'battleship', status: CellStates.hit };

  positions[3][3] = { name: 'battleship', status: CellStates.hit };
  positions[3][4] = { name: 'battleship', status: CellStates.hit };
  positions[3][5] = { name: 'battleship', status: CellStates.unguessed };

  // Add some misses
  positions[4][1] = { name: null, status: CellStates.miss };
  positions[6][3] = { name: null, status: CellStates.miss };
  positions[7][8] = { name: null, status: CellStates.miss };
  positions[8][5] = { name: null, status: CellStates.miss };
  positions[2][7] = { name: null, status: CellStates.miss };

  return positions;
};

export const GameInProgress: Story = {
  args: {
    contextOverrides: {
      computerShips: createGameInProgressBoard(),
    },
  },
};

export const Blank: Story = {
  args: {
    contextOverrides: {
      computerShips: initialiseShipArray(),
    },
  },
};
