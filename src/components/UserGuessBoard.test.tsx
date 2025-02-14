import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserGuessBoard } from './UserGuessBoard';
import { GameContext } from '../GameContext';
import { CellStates } from '../types';

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
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: () => {},
          } as any
        }
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
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: () => {},
          } as any
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
          }))
      );

    render(
      <GameContext.Provider
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: () => {},
          } as any
        }
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
          }))
      );

    render(
      <GameContext.Provider
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: setComputerShips,
            setPlayerTurn: () => {},
          } as any
        }
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
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: setComputerShips,
          } as any
        }
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
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: () => {},
          } as any
        }
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
          }))
      );

    render(
      <GameContext.Provider
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: setComputerShips,
            setPlayerTurn: () => {},
          } as any
        }
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
          }))
      );

    render(
      <GameContext.Provider
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: setComputerShips,
            setPlayerTurn: () => {},
          } as any
        }
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
        value={
          {
            computerShips: mockComputerShips,
            userShips: mockComputerShips,
            setUserShips: () => {},
            setComputerShips: () => {},
          } as any
        }
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveTextContent('✔️');
    expect(cells[1]).toHaveTextContent('❌');
    expect(cells[2]).toHaveTextContent('');
  });
});
