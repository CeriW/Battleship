import React from 'react';
import { renderHook } from '@testing-library/react';
import { useMakeComputerGuess } from './makeComputerGuess';
import { GameContext, GameContextType } from '../GameContext';
import { CellStates, PositionArray } from '../types';
import { calculateHeatMap } from './calculateHeatMap';
import { ai } from '../ai-behaviour';

// Mock dependencies
jest.mock('./calculateHeatMap');
jest.mock('../ai-behaviour', () => ({
  ai: {
    heatMapSimulations: 100,
  },
}));

describe('useMakeComputerGuess', () => {
  const mockSetUserShips = jest.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const mockShips: PositionArray = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            name: null,
            status: CellStates.unguessed,
          }))
      );

    return (
      <GameContext.Provider
        value={
          {
            userShips: mockShips,
            computerShips: mockShips,
            setUserShips: mockSetUserShips,
            setComputerShips: jest.fn(),
            playerTurn: 'computer',
            setPlayerTurn: jest.fn(),
          } as unknown as GameContextType
        }
      >
        {children}
      </GameContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should make a hit guess when ship is present', () => {
    // Mock heat map to return highest value at (2,3)
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[2][3] = 50;
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const userShips: PositionArray = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            name: null,
            status: CellStates.unguessed,
          }))
      );
    userShips[2][3] = { name: 'destroyer', status: CellStates.unguessed };

    const { result } = renderHook(() => useMakeComputerGuess(), {
      wrapper: ({ children }) => (
        <GameContext.Provider
          value={
            {
              userShips,
              computerShips: userShips,
              setUserShips: mockSetUserShips,
              setComputerShips: jest.fn(),
              playerTurn: 'computer',
              setPlayerTurn: jest.fn(),
            } as unknown as GameContextType
          }
        >
          {children}
        </GameContext.Provider>
      ),
    });

    result.current();

    expect(mockSetUserShips).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            name: 'destroyer',
            status: CellStates.hit,
          }),
        ]),
      ])
    );
  });

  test('should make a miss guess when no ship is present', () => {
    // Mock heat map to return highest value at (1,1)
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[1][1] = 50;
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const { result } = renderHook(() => useMakeComputerGuess(), { wrapper });

    result.current();

    expect(mockSetUserShips).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            name: null,
            status: CellStates.miss,
          }),
        ]),
      ])
    );
  });

  test('should ignore cells with heatMapSimulations value', () => {
    // Mock heat map with some cells having heatMapSimulations value
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[0][0] = ai.heatMapSimulations; // This is the heatMapSimulations value, should be ignored
    mockHeatMap[1][1] = 50; // This should be selected
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const { result } = renderHook(() => useMakeComputerGuess(), { wrapper });

    result.current();

    // Should select (1,1) instead of (0,0)
    expect(mockSetUserShips).toHaveBeenCalled();
    const call = mockSetUserShips.mock.calls[0][0];
    expect(call[1][1].status).toBe(CellStates.miss);
  });

  test('should not modify already guessed cells', () => {
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[1][1] = 50;
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const userShips: PositionArray = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            name: null,
            status: CellStates.unguessed,
          }))
      );
    userShips[1][1] = { name: 'destroyer', status: CellStates.hit }; // Already hit

    const { result } = renderHook(() => useMakeComputerGuess(), {
      wrapper: ({ children }) => (
        <GameContext.Provider
          value={
            {
              userShips,
              computerShips: userShips,
              setUserShips: mockSetUserShips,
              setComputerShips: jest.fn(),
              playerTurn: 'computer',
              setPlayerTurn: jest.fn(),
            } as unknown as GameContextType
          }
        >
          {children}
        </GameContext.Provider>
      ),
    });

    result.current();
    expect(mockSetUserShips).not.toHaveBeenCalled();
  });

  test('should handle multiple cells with same maximum heat value', () => {
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[1][1] = 50;
    mockHeatMap[2][2] = 50;
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const { result } = renderHook(() => useMakeComputerGuess(), { wrapper });

    result.current();

    // Verify that one of the maximum value cells was chosen
    const call = mockSetUserShips.mock.calls[0][0];
    const wasMaxValueCellChosen = call[1][1].status === CellStates.miss || call[2][2].status === CellStates.miss;
    expect(wasMaxValueCellChosen).toBe(true);
  });

  test('should maintain rest of board state unchanged', () => {
    const mockHeatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    mockHeatMap[1][1] = 50;
    (calculateHeatMap as jest.Mock).mockReturnValue(mockHeatMap);

    const originalShips: PositionArray = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            name: null,
            status: CellStates.unguessed,
          }))
      );

    const { result } = renderHook(() => useMakeComputerGuess(), {
      wrapper: ({ children }) => (
        <GameContext.Provider
          value={
            {
              userShips: originalShips,
              computerShips: originalShips,
              setUserShips: mockSetUserShips,
              setComputerShips: jest.fn(),
              playerTurn: 'computer',
              setPlayerTurn: jest.fn(),
            } as unknown as GameContextType
          }
        >
          {children}
        </GameContext.Provider>
      ),
    });

    result.current();

    const newBoard = mockSetUserShips.mock.calls[0][0];
    // Check that only one cell was modified
    let modifiedCells = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (newBoard[i][j]?.status !== originalShips[i][j]?.status) {
          modifiedCells++;
        }
      }
    }
    expect(modifiedCells).toBe(1);
  });
});
