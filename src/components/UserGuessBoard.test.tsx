import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserGuessBoard } from './UserGuessBoard';
import { GameContext, GameContextType } from '../GameContext';
import { CellStates, ShipNames, PositionArray } from '../types';
import defaultTestContext from '../defaultTestContext';

// Mock AchievementContext
jest.mock('../context/AchievementContext', () => ({
  useAchievements: () => ({
    achievements: [],
    progress: {},
    checkAchievements: jest.fn(),
    unlockAchievement: jest.fn(),
    resetProgress: jest.fn(),
  }),
}));

describe('UserGuessBoard', () => {
  test('Renders a basic board', () => {
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    expect(screen.getByTestId('user-guess-board')).toBeInTheDocument();
    expect(screen.getAllByTestId('row-marker')).toHaveLength(10);
    expect(screen.getAllByTestId('column-marker')).toHaveLength(11);
    expect(screen.getAllByTestId('cell')).toHaveLength(100);
  });

  test('Renders a board with a hit', () => {
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.hit,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={
          {
            ...defaultTestContext,
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
          } as unknown as GameContextType
        }
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    expect(screen.getAllByTestId('cell')[0]).toHaveClass('hit');
  });

  test('Renders a board with a miss', () => {
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.miss,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    expect(screen.getAllByTestId('cell')[0]).toHaveClass('miss');
  });

  test('Handles cell clicks correctly', async () => {
    const setComputerShips = jest.fn();
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          gameStatus: 'user-turn',
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cells = screen.getAllByTestId('cell');
    await userEvent.click(cells[0]);

    expect(setComputerShips).toHaveBeenCalled();
  });

  test('Already guessed cells cannot be clicked', async () => {
    const setComputerShips = jest.fn();
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.hit,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          gameStatus: 'user-turn',
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cell = screen.getAllByTestId('cell')[0];
    expect(cell).toHaveClass('hit');

    // Try to click the cell
    await userEvent.click(cell);

    // Verify that setComputerShips was not called
    expect(setComputerShips).not.toHaveBeenCalled();
  });

  test('Displays correct row and column markers', () => {
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    // Check row markers (A-J)
    const rowMarkers = screen.getAllByTestId('row-marker');
    expect(rowMarkers[0]).toHaveTextContent('A');
    expect(rowMarkers[9]).toHaveTextContent('J');

    // Check column markers (1-10)
    const columnMarkers = screen.getAllByTestId('column-marker');
    expect(columnMarkers[1]).toHaveTextContent('1');
    expect(columnMarkers[10]).toHaveTextContent('10');
  });

  test('Handles successful hit on ship', async () => {
    const setComputerShips = jest.fn();
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.hit,
            name: 'carrier' as ShipNames,
          }))
      );

    mockComputerShips[0][0] = { status: CellStates.unguessed, name: 'carrier' };

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          gameStatus: 'user-turn',
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cell = screen.getAllByTestId('cell')[0];
    await userEvent.click(cell);

    expect(setComputerShips).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            status: CellStates.hit,
            name: 'carrier' as ShipNames,
          }),
        ]),
      ])
    );
  });

  test('Handles miss when no ship present', async () => {
    const setComputerShips = jest.fn();
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          gameStatus: 'user-turn',
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cell = screen.getAllByTestId('cell')[0];
    await userEvent.click(cell);

    expect(setComputerShips).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            status: CellStates.miss,
            name: null,
          }),
        ]),
      ])
    );
  });

  test('Displays correct symbols for different cell states', () => {
    const mockComputerShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    // Set up different states in first row
    mockComputerShips[0][0] = { status: CellStates.hit, name: null };
    mockComputerShips[0][1] = { status: CellStates.miss, name: null };
    mockComputerShips[0][2] = { status: CellStates.unguessed, name: null };

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveClass('hit');
    expect(cells[1]).toHaveClass('miss');
    expect(cells[2]).toHaveClass('unguessed');
    expect(cells[2]).not.toHaveClass('miss');
    expect(cells[2]).not.toHaveClass('hit');
  });

  test('applies correct className based on cell status', () => {
    const mockComputerShips: PositionArray = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null,
          }))
      );

    // Set up a carrier ship that spans multiple cells but is not completely sunk
    mockComputerShips[0][0] = { name: 'carrier', status: CellStates.hit };
    mockComputerShips[0][1] = { name: 'carrier', status: CellStates.unguessed };
    mockComputerShips[0][2] = { name: 'carrier', status: CellStates.unguessed };
    mockComputerShips[0][3] = { name: 'carrier', status: CellStates.unguessed };
    mockComputerShips[0][4] = { name: 'carrier', status: CellStates.unguessed };

    // Set a miss cell
    mockComputerShips[0][5] = { name: null, status: CellStates.miss };

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveClass('cell', CellStates.hit);
    expect(cells[5]).toHaveClass('cell', CellStates.miss);
    expect(cells[6]).toHaveClass('cell');
  });

  test('should not allow clicking on an already hit cell', () => {
    const mockSetComputerShips = jest.fn();
    const mockSetGameStatus = jest.fn();

    const computerShips = Array(10)
      .fill(null)
      .map(() => Array(10).fill({ name: null, status: CellStates.unguessed }));
    computerShips[0][0] = { name: 'carrier', status: CellStates.hit };

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips,
          setComputerShips: mockSetComputerShips,
          setgameStatus: mockSetGameStatus,
          gameStatus: 'user-turn',
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const hitCell = screen.getAllByTestId('cell')[0];
    fireEvent.click(hitCell);

    expect(mockSetComputerShips).not.toHaveBeenCalled();
    expect(mockSetGameStatus).not.toHaveBeenCalled();
  });

  test('should not allow clicking on an already missed cell', () => {
    const mockSetComputerShips = jest.fn();
    const mockSetGameStatus = jest.fn();

    const computerShips = Array(10)
      .fill(null)
      .map(() => Array(10).fill({ name: null, status: CellStates.unguessed }));
    computerShips[0][0] = { name: null, status: CellStates.miss };

    render(
      <GameContext.Provider
        value={
          {
            computerShips,
            setComputerShips: mockSetComputerShips,
            setgameStatus: mockSetGameStatus,
            gameStatus: 'user-turn',
            addToLog: jest.fn(),
          } as any
        }
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const missedCell = screen.getAllByTestId('cell')[0];
    fireEvent.click(missedCell);

    expect(mockSetComputerShips).not.toHaveBeenCalled();
    expect(mockSetGameStatus).not.toHaveBeenCalled();
  });

  test('should not allow clicking when it is computers turn', () => {
    const mockSetComputerShips = jest.fn();
    const mockSetGameStatus = jest.fn();

    render(
      <GameContext.Provider
        value={
          {
            computerShips: Array(10)
              .fill(null)
              .map(() => Array(10).fill({ name: null, status: CellStates.unguessed })),
            setComputerShips: mockSetComputerShips,
            setgameStatus: mockSetGameStatus,
            gameStatus: 'computer-turn',
            addToLog: jest.fn(),
          } as any
        }
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cell = screen.getAllByTestId('cell')[0];
    fireEvent.click(cell);

    expect(mockSetComputerShips).not.toHaveBeenCalled();
    expect(mockSetGameStatus).not.toHaveBeenCalled();
  });
});
