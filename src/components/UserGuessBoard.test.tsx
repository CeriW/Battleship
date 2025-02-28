import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserGuessBoard } from './UserGuessBoard';
import { GameContext, GameContextType } from '../GameContext';
import { CellStates, ShipNames } from '../types';
import defaultTestContext from '../defaultGameContext';
import { makeComputerGuess } from '../logic/makeComputerGuess';

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
            sunk: false,
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
            sunk: false,
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

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('✔️');
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
            sunk: false,
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

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('❌');
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
            sunk: false,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          playerTurn: 'user',
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
            sunk: false,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          playerTurn: 'user',
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
            sunk: false,
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
            status: CellStates.unguessed,
            name: 'carrier',
            sunk: false,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          playerTurn: 'user',
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
            name: 'carrier',
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
            sunk: false,
          }))
      );

    render(
      <GameContext.Provider
        value={{
          ...defaultTestContext,
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setComputerShips: setComputerShips,
          playerTurn: 'user',
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
            sunk: false,
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
            sunk: false,
          }))
      );

    // Set up different states in first row
    mockComputerShips[0][0] = { status: CellStates.hit, name: null, sunk: false };
    mockComputerShips[0][1] = { status: CellStates.miss, name: null, sunk: false };
    mockComputerShips[0][2] = { status: CellStates.unguessed, name: null, sunk: false };

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
    expect(cells[0]).toHaveTextContent('✔️');
    expect(cells[1]).toHaveTextContent('❌');
    expect(cells[2]).toHaveTextContent('');
  });

  test('applies correct className based on cell status', () => {
    const mockContext = {
      ...defaultTestContext,
      computerShips: Array(10).fill(Array(10).fill(null)),
      userShips: Array(10).fill(Array(10).fill(null)),
      playerTurn: 'user' as 'user' | 'computer',
    };

    // Set a specific cell status to test
    mockContext.computerShips[0][0] = { name: 'ship', status: CellStates.hit, sunk: false };
    mockContext.computerShips[0][1] = { name: null, status: CellStates.miss, sunk: false };

    render(
      <GameContext.Provider value={mockContext}>
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveClass('cell', CellStates.hit);
    expect(cells[1]).toHaveClass('cell', CellStates.miss);
    expect(cells[2]).toHaveClass('cell');
  });

  test('correctly marks a ship as sunk when all its cells are hit', () => {
    const userShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null as ShipNames | null,
            sunk: false,
          }))
      );

    // Place a 2-cell ship
    userShips[0][0] = { status: CellStates.hit, name: 'destroyer', sunk: false };
    userShips[0][1] = { status: CellStates.hit, name: 'destroyer', sunk: false };

    const result = makeComputerGuess(userShips, [0, 1]);

    // Check if the ship is marked as sunk after hitting its last cell
    expect(result[0][0].sunk).toBe(true);
    expect(result[0][1].sunk).toBe(true);
  });

  test('does not mark a ship as sunk when some cells are still not hit', () => {
    const userShips = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            status: CellStates.unguessed,
            name: null as ShipNames | null,
            sunk: false,
          }))
      );

    // Place a 3-cell ship with only 2 hits
    userShips[0][0] = { status: CellStates.hit, name: 'cruiser', sunk: false };
    userShips[0][1] = { status: CellStates.hit, name: 'cruiser', sunk: false };
    userShips[0][2] = { status: CellStates.unguessed, name: 'cruiser', sunk: false };

    const result = makeComputerGuess(userShips, [1, 0]);

    // Check that the ship is not marked as sunk
    expect(result[0][0].sunk).toBe(false);
    expect(result[0][1].sunk).toBe(false);
    expect(result[0][2].sunk).toBe(false);
  });
});
