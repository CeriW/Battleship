import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { UserGuessBoard } from './UserGuessBoard';
import { GameContext } from '../GameContext'; // Adjust the import path as needed
import { CellStates } from '../types'; // You may need to adjust this import path

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
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setUserShips: () => {},
          setComputerShips: () => {},
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
        value={{
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setUserShips: () => {},
          setComputerShips: () => {},
        }}
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
        value={{
          computerShips: mockComputerShips,
          userShips: mockComputerShips,
          setUserShips: () => {},
          setComputerShips: () => {},
        }}
      >
        <UserGuessBoard />
      </GameContext.Provider>
    );

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('❌');
  });
});
